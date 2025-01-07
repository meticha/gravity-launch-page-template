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
    const targetDate = new Date(2025, 0, 15); // January 15, 2025

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
    <div className="flex flex-col items-center p-4 max-w-full">
      <div className="flex  justify-center gap-2 sm:gap-4">
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
              className="w-14 h-18 sm:w-20 sm:h-24 md:w-24 md:h-32 bg-cyan-600 rounded-lg flex flex-col items-center justify-center shadow-lg"
            >
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1,
                }}
                className="text-xl sm:text-2xl md:text-4xl font-bold text-white"
              >
                {value.toString().padStart(2, "0")}
              </motion.span>
              <span className="text-xs sm:text-sm text-white/80 capitalize">
                {unit}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-4 text-center"
      >
        Countdown to January 15, 2025
      </motion.h2>
    </div>
  );
};

export default CountdownTimer;
