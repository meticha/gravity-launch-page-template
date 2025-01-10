import React, { useRef, useContext, useEffect, useState } from "react";
import { GravityContext } from "./gravity";
import { cn } from "@/utils";

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
    if (!elementRef.current) return;

    const observer = new ResizeObserver(() => {
      setIsReady(true);
    });

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isReady || !elementRef.current || !context) return;

    const element = elementRef.current;
    if (element.offsetWidth === 0 || element.offsetHeight === 0) {
      return;
    }

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
  }, [
    context,
    isReady,
    props,
    children,
    matterBodyOptions,
    isDraggable,
    x,
    y,
    angle,
    bodyType,
    sampleLength,
  ]);

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

export default MatterBody;
