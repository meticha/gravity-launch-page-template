import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(2025, 0, 22); // January 22, 2025

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="px-1 py-3 sm:p-3 md:p-4 lg:p-6">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-4 sm:mb-5">
            Countdown to Launch
          </h2>
          <div className="flex justify-center gap-1 sm:gap-2 md:gap-3">
            <AnimatePresence mode="popLayout">
              {Object.entries(timeLeft).map(([unit, value], index) => (
                <motion.div
                  key={unit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex flex-col items-center justify-center shadow-md">
                    <motion.span
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: index * 0.1,
                      }}
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white"
                    >
                      {value.toString().padStart(2, "0")}
                    </motion.span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-300 mt-1 capitalize">
                    {unit}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="bg-gray-700 px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5">
          <p className="text-center text-gray-300 text-xs sm:text-sm md:text-base">
            Launching on{" "}
            <span className="font-semibold text-white">January 17, 2025</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CountdownTimer;