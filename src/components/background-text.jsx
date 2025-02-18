import React, { useState } from "react";
import AnimatedText from "./AnimatedText";

const BackgroundText = ({ onExclamationClick, stopConfetti }) => {
  const [showAnimatedText, setShowAnimatedText] = useState(false);

  const handleExclamationClick = () => {
    onExclamationClick();
    setTimeout(() => setShowAnimatedText(true), 1000); // Show animated text after 1 second
  };

  const handleHideAnimatedText = () => {
    stopConfetti();
    setShowAnimatedText(false);
  };

  return (
    <div className="inset-x-0 top-8 sm:top-16 md:top-24 lg:top-32 flex flex-col items-center justify-start text-center">
      {/* YES! Text */}
      <h1 className="absolute z-10 inset-x-0 top-8 sm:top-16 md:top-24 lg:top-32 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-2 sm:mb-4">
        YES
        <span
          className="cursor-pointer pointer-events-auto"
          onClick={handleExclamationClick}
          role="button"
          tabIndex={0}
          aria-label="Start confetti"
        >
          !
        </span>
      </h1>

      {/* Other content */}
      <div className="relative mt-48 sm:mt-56 md:mt-64 lg:mt-72 w-full ">
        <p className="absolute z-10 w-full text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight font-bold text-white/70 px-4">
          Jetpack Compose Snippets is{" "}
          <a href="https://jetpackcomposesnippets.meticha.com?utm_source=snippet_launch_page&utm_medium=website" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline" >LIVE NOW!</a> 🚀
          <br />
          Click the <span className="text-blue-400">
            bottom left corner
          </span>{" "}
          button to explore it now!
        </p>
      </div>
      {/* Animated Text */}
      <AnimatedText
        isVisible={showAnimatedText}
        onHide={handleHideAnimatedText}
      />
    </div>
  );
};

export default BackgroundText;
