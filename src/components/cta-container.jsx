import React from "react";
import { withPhysics } from "./physics-drag";

const CallToAction = () => {
  return (
    <div className=" bg-white p-8 rounded-2xl z-100">
      <h2 className="text-6xl font-bold">Build Anything with Compose</h2>
    </div>
  );
};

export default withPhysics(CallToAction);
