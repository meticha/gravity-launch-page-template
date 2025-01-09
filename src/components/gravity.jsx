import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { calculatePosition } from "@/utils";
import { parsePathToVertices } from "@/utils";
import { debounce } from "lodash";
import Matter, {
  Bodies,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  World,
} from "matter-js";
import { cn } from "@/utils";
import decomp from "poly-decomp";
import { getRandomNumber } from "../utils";

const GravityContext = createContext(null);

const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.6,
    density: 0.001,
    isStatic: false,
    slop: 0.05,
    frictionStatic: 0.5,
    frictionAir: 0.001,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x,
  y,
  angle = 0,
  ...props
}) => {
  const elementRef = useRef(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(GravityContext);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for element to be properly mounted and measured
    if (!elementRef.current) return;

    const observer = new ResizeObserver(() => {
      setIsReady(true);
    });

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isReady || !elementRef.current || !context) return;

    // Ensure element has proper dimensions before registering
    const element = elementRef.current;
    if (element.offsetWidth === 0 || element.offsetHeight === 0) {
      return;
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const timer = requestAnimationFrame(() => {
      context.registerElement(idRef.current, element, {
        children,
        matterBodyOptions,
        bodyType,
        sampleLength,
        isDraggable,
        x,
        y,
        angle,
        ...props,
      });
    });

    return () => {
      cancelAnimationFrame(timer);
      context.unregisterElement(idRef.current);
    };
  }, [context, isReady, props, children, matterBodyOptions, isDraggable]);

  const isLinkContainer = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === "a"
  );

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute opacity-0 transition-opacity duration-300",
        isReady && "opacity-100",
        className,
        isDraggable && !isLinkContainer && "pointer-events-none"
      )}
      style={{ touchAction: "none" }}
    >
      {children}
    </div>
  );
};

const Gravity = forwardRef(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      addTopWall = true,
      autoStart = true,
      className,
      ...props
    },
    ref
  ) => {
    const canvas = useRef(null);
    const engine = useRef(
      Engine.create({
        enableSleeping: false,
        constraintIterations: 4,
        positionIterations: 8,
        velocityIterations: 8,
      })
    );
    const render = useRef();
    const runner = useRef();
    const bodiesMap = useRef(new Map());
    const frameId = useRef();
    const mouseConstraint = useRef();
    const mouseDown = useRef(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const isRunning = useRef(false);

    const registerElement = useCallback(
      (id, element, props) => {
        if (!canvas.current || !isInitialized) return;

        // Ensure canvas dimensions are available
        const canvasRect = canvas.current.getBoundingClientRect();
        if (canvasRect.width === 0 || canvasRect.height === 0) return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const angle = (props.angle || 0) * (Math.PI / 180);
        const x = calculatePosition(props.x, canvasRect.width, width);
        const y = calculatePosition(props.y, canvasRect.height, height, true); // 'true' for vertical launch

        let body;

        try {
          if (props.bodyType === "circle") {
            const radius = Math.max(width, height) / 2;
            body = Bodies.circle(x, y, radius, {
              ...props.matterBodyOptions,
              angle: angle,
              render: {
                fillStyle: debug ? "#888888" : "#00000000",
                strokeStyle: debug ? "#333333" : "#00000000",
                lineWidth: debug ? 3 : 0,
              },
            });
          } else if (props.bodyType === "svg") {
            const paths = element.querySelectorAll("path");
            const vertexSets = [];

            paths.forEach((path) => {
              const d = path.getAttribute("d");
              const p = parsePathToVertices(d, props.sampleLength);
              vertexSets.push(p);
            });

            body = Bodies.fromVertices(x, y, vertexSets, {
              ...props.matterBodyOptions,
              angle: angle,
              render: {
                fillStyle: debug ? "#888888" : "#00000000",
                strokeStyle: debug ? "#333333" : "#00000000",
                lineWidth: debug ? 3 : 0,
              },
            });
          } else {
            body = Bodies.rectangle(x, y, width, height, {
              ...props.matterBodyOptions,
              angle: angle,
              render: {
                fillStyle: debug ? "#888888" : "#00000000",
                strokeStyle: debug ? "#333333" : "#00000000",
                lineWidth: debug ? 3 : 0,
              },
            });
          }

          if (body) {
            World.add(engine.current.world, [body]);
            bodiesMap.current.set(id, { element, body, props });
          }
        } catch (error) {
          console.error("Error creating matter body:", error);
        }
      },
      [debug, isInitialized]
    );

    const unregisterElement = useCallback((id) => {
      const body = bodiesMap.current.get(id);
      if (body) {
        World.remove(engine.current.world, body.body);
        bodiesMap.current.delete(id);
      }
    }, []);

    const updateElements = useCallback(() => {
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position;
        const rotation = body.angle * (180 / Math.PI);

        element.style.top = `${y}px`;
        element.style.left = `${x}px`;
        element.style.transform = `translate(-50%,-50%) rotate(${rotation}deg) `;
      });

      frameId.current = requestAnimationFrame(updateElements);
    }, []);

    useEffect(() => {
      if (!canvas.current) return;

      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 100); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    }, []);

    const initializeRenderer = useCallback(() => {
      if (!canvas.current || !isInitialized) return;

      const height = canvas.current.offsetHeight;
      const width = canvas.current.offsetWidth;

      Common.setDecomp(decomp);

      engine.current.gravity.x = gravity.x;
      // engine.current.gravity.y = gravity.y * 0.001 * 9.81; // Scale gravity to be more realistic

      engine.current.gravity.y = gravity.y;

      render.current = Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
          pixelRatio: window.devicePixelRatio, // Added for better rendering
        },
      });

      const mouse = Mouse.create(render.current.canvas);
      mouse.pixelRatio = window.devicePixelRatio; // Scale mouse coordinates

      mouseConstraint.current = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          damping: 0.1, // Added damping for smoother dragging
          render: {
            visible: debug,
          },
        },
      });

      const walls = [
        Bodies.rectangle(width / 2, height + 10, width, 20, {
          isStatic: true,
          friction: 1,
          restitution: 0.3, // Added restitution to walls
          render: { visible: debug },
        }),
        Bodies.rectangle(width + 10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
        Bodies.rectangle(-10, height / 2, 20, height, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
      ];

      if (addTopWall) {
        walls.push(
          Bodies.rectangle(width / 2, -10, width, 20, {
            isStatic: true,
            friction: 1,
            render: { visible: debug },
          })
        );
      }

      const touchingMouse = () =>
        Query.point(
          engine.current.world.bodies,
          mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
        ).length > 0;

      if (grabCursor) {
        Events.on(engine.current, "beforeUpdate", () => {
          if (canvas.current) {
            if (!mouseDown.current && !touchingMouse()) {
              canvas.current.style.cursor = "default";
            } else if (touchingMouse()) {
              canvas.current.style.cursor = mouseDown.current
                ? "grabbing"
                : "grab";
            }
          }
        });

        canvas.current.addEventListener("mousedown", () => {
          mouseDown.current = true;
          if (canvas.current) {
            canvas.current.style.cursor = touchingMouse()
              ? "grabbing"
              : "default";
          }
        });

        canvas.current.addEventListener("mouseup", () => {
          mouseDown.current = false;
          if (canvas.current) {
            canvas.current.style.cursor = touchingMouse() ? "grab" : "default";
          }
        });
      }

      World.add(engine.current.world, [mouseConstraint.current, ...walls]);
      render.current.mouse = mouse;

      runner.current = Runner.create();
      Render.run(render.current);
      updateElements();
      runner.current.enabled = false;

      if (autoStart) {
        runner.current.enabled = true;
        startEngine();
      }

      Events.on(engine.current, "collisionStart", (event) => {
        event.pairs.forEach((pair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;

          // Apply small impulse on collision to prevent sticking
          const force = 0.0001;
          Matter.Body.applyForce(bodyA, bodyA.position, {
            x: (Math.random() - 0.5) * force,
            y: (Math.random() - 0.5) * force,
          });
          Matter.Body.applyForce(bodyB, bodyB.position, {
            x: (Math.random() - 0.5) * force,
            y: (Math.random() - 0.5) * force,
          });
        });
      });
    }, [
      updateElements,
      debug,
      autoStart,
      gravity.x,
      gravity.y,
      addTopWall,
      grabCursor,
      isInitialized,
    ]);

    const clearRenderer = useCallback(() => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }

      if (mouseConstraint.current) {
        World.remove(engine.current.world, mouseConstraint.current);
      }

      if (render.current) {
        Mouse.clearSourceEvents(render.current.mouse);
        Render.stop(render.current);
        render.current.canvas.remove();
      }

      if (runner.current) {
        Runner.stop(runner.current);
      }

      if (engine.current) {
        World.clear(engine.current.world, false);
        Engine.clear(engine.current);
      }

      bodiesMap.current.clear();
    }, []);

    const handleResize = useCallback(() => {
      if (!canvas.current || !resetOnResize) return;

      const newWidth = canvas.current.offsetWidth;
      const newHeight = canvas.current.offsetHeight;

      setCanvasSize({ width: newWidth, height: newHeight });
      clearRenderer();
      initializeRenderer();
    }, [clearRenderer, initializeRenderer, resetOnResize]);

    const startEngine = useCallback(() => {
      if (runner.current) {
        runner.current.enabled = true;
        Runner.run(runner.current, engine.current);
      }
      if (render.current) {
        Render.run(render.current);
      }
      frameId.current = requestAnimationFrame(updateElements);
      isRunning.current = true;
    }, [updateElements]);

    const stopEngine = useCallback(() => {
      if (!isRunning.current) return;

      if (runner.current) {
        Runner.stop(runner.current);
      }
      if (render.current) {
        Render.stop(render.current);
      }
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      isRunning.current = false;
    }, []);

    const reset = useCallback(() => {
      stopEngine();
      bodiesMap.current.forEach(({ element, body, props }) => {
        body.angle = props.angle || 0;
        const x = calculatePosition(
          props.x,
          canvasSize.width,
          element.offsetWidth
        );
        const y = calculatePosition(
          props.y,
          canvasSize.height,
          element.offsetHeight
        );
        body.position.x = x;
        body.position.y = y;
      });
      updateElements();
      handleResize();
    }, [stopEngine, updateElements, handleResize, canvasSize]);

    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [startEngine, stopEngine, reset]
    );

    useEffect(() => {
      if (!resetOnResize) return;

      const debouncedResize = debounce(handleResize, 500);
      window.addEventListener("resize", debouncedResize);

      return () => {
        window.removeEventListener("resize", debouncedResize);
        debouncedResize.cancel();
      };
    }, [handleResize, resetOnResize]);

    useEffect(() => {
      initializeRenderer();
      return clearRenderer;
    }, [initializeRenderer, clearRenderer]);

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div
          ref={canvas}
          className={cn(
            className,
            "fixed inset-0 w-full h-full",
            !isInitialized && "opacity-0"
          )}
          {...props}
        >
          {children}
        </div>
      </GravityContext.Provider>
    );
  }
);

Gravity.displayName = "Gravity";

export default Gravity;
export { MatterBody };
