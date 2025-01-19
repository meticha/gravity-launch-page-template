import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FloatingLabel = () => {
  const text = " POWERED BY METICHA ";
  const characters = text.split("");

  // Calculate translation distance based on container size
  const getTranslateY = (containerSize) => {
    return -(containerSize / 2) + containerSize * 0.15; // Adjust the 0.15 multiplier to fine-tune the radius
  };

  const [translateY, setTranslateY] = useState(-40);

  useEffect(() => {
    const updateTranslateY = () => {
      let size;
      if (window.innerWidth < 640) size = 68; // 16 * 4 (w-16)
      else if (window.innerWidth < 768) size = 80; // 20 * 4 (sm:w-20)
      else if (window.innerWidth < 1024) size = 105; // 24 * 4 (md:w-24)
      else size = 110; // lg:w-[100px]

      setTranslateY(getTranslateY(size));
    };

    updateTranslateY();
    window.addEventListener("resize", updateTranslateY);
    return () => window.removeEventListener("resize", updateTranslateY);
  }, []);

  return (
    <motion.a
      href="https://meticha.com?utm_source=snippet_launch_page&utm_medium=website"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[100px] lg:h-[100px] bg-purple-600 rounded-full overflow-hidden transition-colors duration-300 group-hover:bg-black">
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
              className="absolute text-white text-[10px] sm:text-xs md:text-sm font-semibold origin-[0_0] "
              style={{
                transform: `rotate(${
                  index * (360 / characters.length)
                }deg) translateY(${translateY}px)`,
                transformOrigin: "50% 50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>

        {/* Center Circle with Icons */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
          <motion.div className="relative w-full h-full">
            {/* Logo Image */}
            <motion.img
              src="/assets/Group 25.svg"
              alt="Logo"
              className="absolute inset-0 w-full h-full object-contain p-1 sm:p-2 transition-transform duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
            />
            {/* Copy of Logo Image */}
            <motion.img
              src="/assets/Group 25.svg"
              alt="Logo"
              className="absolute inset-0 w-full h-full object-contain p-1 sm:p-2 translate-x-[-150%] translate-y-[150%] transition-transform duration-300 delay-100 group-hover:translate-x-0 group-hover:translate-y-0"
            />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

export default FloatingLabel;
