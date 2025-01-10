import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingLabel = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 bg-white backdrop-blur-md 
                 px-3 py-2 rounded-full shadow-lg cursor-pointer
                 hover:bg-white/90 hover:shadow-xl transition-all duration-300
                 flex items-center justify-end overflow-hidden"
      initial={{ width: "auto", opacity: 0, y: 20 }}
      animate={{
        width: isAnimating ? "200px" : "auto", // Increased width for link
        opacity: 1,
        y: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
      }}
      onClick={() => setIsAnimating((prev) => !prev)}
    >
      <div className="flex items-center gap-3 w-full">
        <AnimatePresence mode="popLayout">
          {isAnimating && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 0.8,
              }}
            >
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Powered by
              </span>
              <a
                href="https://meticha.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-500 underline hover:text-blue-700 transition-colors duration-200"
              >
                Meticha
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="relative w-8 h-8 md:w-10 md:h-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src="/assets/Group 25.svg"
            alt="Logo"
            className="w-full h-full object-contain"
            style={{
              filter: "drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1))",
            }}
            animate={{
              rotate: isAnimating ? 360 : 0,
            }}
            transition={{
              rotate: {
                type: "spring",
                stiffness: 60,
                damping: 15,
                mass: 1,
              },
            }}
          />
          <motion.div
            className="absolute inset-0 bg-purple-500 rounded-full opacity-0"
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FloatingLabel;
