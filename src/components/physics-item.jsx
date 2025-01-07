import React from "react";
import { withPhysics } from "./with-physics";

const PhysicsItem = ({ color, size }) => {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shadow-lg"
      style={{
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.3}px`,
      }}
    >
      {size}
    </div>
  );
};

export default withPhysics(PhysicsItem);
