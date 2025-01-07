import React from "react";
import { withPhysics } from "./with-physics";
import { FaReact, FaNodeJs, FaPython, FaJava, FaDocker } from "react-icons/fa";
import { SiTypescript, SiJavascript, SiRust } from "react-icons/si";

const icons = {
  React: FaReact,
  Node: FaNodeJs,
  Python: FaPython,
  Java: FaJava,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  Rust: SiRust,
  Docker: FaDocker,
};

const TechIcon = ({ name, color, size }) => {
  const IconComponent = icons[name];

  return (
    <div
      className="flex items-center justify-center rounded-full bg-white shadow-lg"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <IconComponent color={color} size={size * 0.6} />
    </div>
  );
};

export default withPhysics(TechIcon);
