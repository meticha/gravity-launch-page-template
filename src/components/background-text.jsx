import React from "react";

const BackgroundText = () => {
  return (
    <div className="absolute z-0 inset-x-0 top-8 sm:top-16 md:top-24 lg:top-32 flex flex-col items-center justify-center text-center pointer-events-none">
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-2 sm:mb-4">
        YES!
      </h1>
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight font-bold text-white/70  0 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl px-4">
      Jetpack Compose Snippets
        <br />
          Your Go-To Library for Ready To Use Snippets.
        <br />
        Launching on 27th January!
      </p>

      
     
     <!--<p className="text-xl sm:text-1xl md:text-2xl lg:text-2xl leading-tight font-bold text-white/70  0 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl px-4 py-8">
      <a href="https://www.producthunt.com/products/jetpack-compose-snippets">Notify Me</a>
     </p>-->
    </div>
  );
};

export default BackgroundText;

