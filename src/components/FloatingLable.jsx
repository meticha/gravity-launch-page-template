import React from "react";
import { motion } from "framer-motion";

const FloatingLabel = () => {
  const text = " POWERED BY METICHA ";
  const characters = text.split("");

  return (
    <motion.a
      href="https://meticha.com"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <div className="relative w-[100px] h-[100px] bg-purple-600 rounded-full overflow-hidden transition-colors duration-300 group-hover:bg-black">
        {/* Rotating Text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
          }}
        >
          {characters.map((char, index) => (
            <span
              key={index}
              className="absolute text-white text-sm font-semibold"
              style={{
                transform: `rotate(${index * (360 / characters.length)}deg) translateY(-40px)`,
                transformOrigin: "center",
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>

        {/* Center Circle with Icons */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
          <motion.div className="relative w-full h-full">
            {/* Logo Image */}
            <motion.img
              src="/assets/Group 25.svg"
              alt="Logo"
              className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
            />
            {/* Copy of Logo Image */}
            <motion.img
              src="/assets/Group 25.svg"
              alt="Logo"
              className="absolute inset-0 w-full h-full object-contain p-2 translate-x-[-150%] translate-y-[150%] transition-transform duration-300 delay-100 group-hover:translate-x-0 group-hover:translate-y-0"
            />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

export default FloatingLabel;
