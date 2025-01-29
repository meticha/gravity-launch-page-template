import React, { useState, useEffect } from "react";

const AnimatedText = ({ isVisible, onHide }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShowText(true), 300);
    } else {
      setShowText(false);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if it's a desktop device
      const isDesktop = window.innerWidth > 1024; // You can adjust this breakpoint

      // Check for F12 or Ctrl+Shift+I
      if (
        isDesktop &&
        (event.key === "F12" ||
          (event.ctrlKey && event.shiftKey && event.key === "I"))
      ) {
        // event.preventDefault(); // Prevent default browser behavior
        onHide();

        // Focus on the console
        setTimeout(() => {
          console.log(
            "%cEaster Egg Found!",
            "font-size: 20px; font-weight: bold; color: #4CAF50;"
          );
          console.error(
            "%cCheck the info section for more details.",
            "font-size: 16px; color: #2196F3;"
          );
          console.warn(
            "%cCheck the info section for more details.",
            "font-size: 16px; color: #2196F3;"
          );
          console.info("Here are the details of the Easter Egg:");
          // You can add more detailed information here
        }, 100);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onHide]);

  // Check if it's a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    return null; // Don't render anything on mobile devices
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
    >
      {/* Background overlay with radial gradient */}
      <div
        className={`absolute inset-0 bg-gradient-radial from-purple-600 to-blue-900 ${
          isVisible ? "scale-100" : "scale-0"
        } transition-transform duration-500 ease-out`}
      ></div>

      {/* Animated rings */}
      <div
        className={`absolute inset-0 ${
          isVisible ? "animate-ping" : ""
        } opacity-75 border-4 border-white rounded-full`}
      ></div>
      <div
        className={`absolute inset-0 ${
          isVisible ? "animate-ping" : ""
        } opacity-50 border-4 border-white rounded-full animation-delay-200`}
      ></div>
      <div
        className={`absolute inset-0 ${
          isVisible ? "animate-ping" : ""
        } opacity-25 border-4 border-white rounded-full animation-delay-200`}
      ></div>

      {/* Text container */}
      <div
        className={`text-center transition-all duration-1000 ease-in-out ${
          showText ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <h2 className="text-6xl md:text-8xl font-extrabold text-white mb-8 animate-bounce">
          BOOM!
        </h2>
        <p className="text-white text-2xl md:text-4xl font-bold animate-pulse px-4">
          Congratulations! You found an Easter Egg!
        </p>
        <p className="text-white text-xl md:text-2xl mt-4 animate-pulse px-4">
          Press F12 or Ctrl+Shift+I to see the surprise in the <b>console!</b>
        </p>
      </div>
    </div>
  );
};

export default AnimatedText;
