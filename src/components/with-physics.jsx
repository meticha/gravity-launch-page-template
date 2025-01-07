import React, { useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

const COLLISION_DAMPING = 0.7; // Reduced from 0.4 for more energy loss
const GRAVITY = 0.4;
const FRICTION = 0.99;
const DRAG_ELASTICITY = 0.1;
const AIR_RESISTANCE = 0.99; // New constant for air resistance
const COEFFICIENT_OF_RESTITUTION = 0.1; // New constant for bouncing
const MINIMUM_VELOCITY = 0.1; // New constant for minimum velocity

export function withPhysics(WrappedComponent) {
  return function WithPhysics({ index, itemsRef, containerRef, ...props }) {
    const elementRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const velocityRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const dragElasticRef = useRef({ x: 0, y: 0 });
    const isInitializedRef = useRef(false);

    useEffect(() => {
      const initializePosition = () => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        const elementRect = elementRef.current?.getBoundingClientRect();
        if (!containerRect || !elementRect) return;

        if (!isInitializedRef.current) {
          const initialX =
            Math.random() * (containerRect.width - elementRect.width);
          const initialY = -elementRect.height - 1000; // Start above the container
          x.set(initialX);
          y.set(initialY);
          lastPositionRef.current = { x: initialX, y: initialY };
          isInitializedRef.current = true;
        }
      };

      initializePosition();

      const updatePosition = () => {
        const containerRect = containerRef.current?.getBoundingClientRect();
        const elementRect = elementRef.current?.getBoundingClientRect();
        if (!containerRect || !elementRect) return;

        const currentX = x.get();
        const currentY = y.get();
        const velocity = velocityRef.current;

        if (!isDraggingRef.current) {
          velocity.y += GRAVITY;
          velocity.x *= FRICTION * AIR_RESISTANCE;
          velocity.y *= FRICTION * AIR_RESISTANCE;

          // Stop motion if velocity is below the minimum threshold
          if (Math.abs(velocity.x) < MINIMUM_VELOCITY) velocity.x = 0;
          if (Math.abs(velocity.y) < MINIMUM_VELOCITY) velocity.y = 0;
        } else {
          const dx = currentX - lastPositionRef.current.x;
          const dy = currentY - lastPositionRef.current.y;
          dragElasticRef.current.x +=
            (dx - dragElasticRef.current.x) * DRAG_ELASTICITY;
          dragElasticRef.current.y +=
            (dy - dragElasticRef.current.y) * DRAG_ELASTICITY;
          velocity.x = dragElasticRef.current.x;
          velocity.y = dragElasticRef.current.y;
        }

        let newX = currentX + velocity.x;
        let newY = currentY + velocity.y;

        // Boundary collisions with coefficient of restitution
        if (newX < 0) {
          newX = 0;
          velocity.x =
            -velocity.x * COLLISION_DAMPING * COEFFICIENT_OF_RESTITUTION;
        } else if (newX > containerRect.width - elementRect.width) {
          newX = containerRect.width - elementRect.width;
          velocity.x =
            -velocity.x * COLLISION_DAMPING * COEFFICIENT_OF_RESTITUTION;
        }

        if (newY > containerRect.height - elementRect.height) {
          newY = containerRect.height - elementRect.height;
          velocity.y =
            -velocity.y * COLLISION_DAMPING * COEFFICIENT_OF_RESTITUTION;
        } else if (newY < 0) {
          newY = 0;
          velocity.y =
            -velocity.y * COLLISION_DAMPING * COEFFICIENT_OF_RESTITUTION;
        }

        // Item collisions
        itemsRef.current.forEach((item, i) => {
          if (i !== index) {
            const dx = newX - item.x;
            const dy = newY - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (elementRect.width + item.width) / 2;

            if (distance < minDistance) {
              const angle = Math.atan2(dy, dx);
              const targetX = newX + Math.cos(angle) * minDistance;
              const targetY = newY + Math.sin(angle) * minDistance;
              const ax = (targetX - newX) * 0.05;
              const ay = (targetY - newY) * 0.05;

              velocity.x += ax * COEFFICIENT_OF_RESTITUTION;
              velocity.y += ay * COEFFICIENT_OF_RESTITUTION;
              itemsRef.current[i].vx -= ax * COEFFICIENT_OF_RESTITUTION;
              itemsRef.current[i].vy -= ay * COEFFICIENT_OF_RESTITUTION;
            }
          }
        });

        x.set(newX);
        y.set(newY);

        itemsRef.current[index] = {
          x: newX,
          y: newY,
          vx: velocity.x,
          vy: velocity.y,
          width: elementRect.width,
          height: elementRect.height,
        };

        lastPositionRef.current = { x: newX, y: newY };

        requestAnimationFrame(updatePosition);
      };

      const animationId = requestAnimationFrame(updatePosition);

      return () => cancelAnimationFrame(animationId);
    }, [x, y, index, itemsRef, containerRef]);

    const handleDragStart = () => {
      isDraggingRef.current = true;
      dragElasticRef.current = { x: 0, y: 0 };
    };

    const handleDrag = (event, info) => {
      x.set(info.point.x);
      y.set(info.point.y);
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
      velocityRef.current = {
        x: dragElasticRef.current.x,
        y: dragElasticRef.current.y,
      };
    };

    return (
      <motion.div
        ref={elementRef}
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={containerRef}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          position: "absolute",
          x,
          y,
          cursor: "grab",
          touchAction: "none",
        }}
      >
        <WrappedComponent {...props} />
      </motion.div>
    );
  };
}
