import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FloatingLabel = () => {
  const metichaText = " POWERED BY METICHA ";
  const productHuntText = " FOLLOW US ON PRODUCTHUNT ";

  const charactersMeticha = metichaText.split("");
  const charactersProductHunt = productHuntText.split("");

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

  const FloatingButton = ({ href, text, characters, positionClass, bgColor,src }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${positionClass} z-50 cursor-pointer group`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <div className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[100px] lg:h-[100px] ${bgColor} rounded-full overflow-hidden transition-colors duration-300 group-hover:bg-black`}>
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
              className="absolute text-white text-[10px] sm:text-xs md:text-sm font-semibold origin-[0_0]"
              style={{
                transform: `rotate(${index * (360 / characters.length)}deg) translateY(${translateY}px)`,
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
              src={src}
              alt="Logo"
              className="absolute inset-0 w-full h-full object-contain p-1 sm:p-2 transition-transform duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
            />
            {/* Copy of Logo Image */}
            <motion.img
              src={src}
              alt="Logo"
              className="absolute inset-0 w-full h-full object-contain p-1 sm:p-2 translate-x-[-150%] translate-y-[150%] transition-transform duration-300 delay-100 group-hover:translate-x-0 group-hover:translate-y-0"
            />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );

  return (
    <>
      <FloatingButton
        href="https://meticha.com?utm_source=snippet_launch_page&utm_medium=website"
        text={metichaText}
        characters={charactersMeticha}
        bgColor={"bg-purple-600"}
        src="/assets/Group 25.svg"
        positionClass="bottom-4 right-4 md:bottom-6 md:right-6"
      />
      <FloatingButton
        href="https://www.producthunt.com/products/jetpack-compose-snippets"
        text={productHuntText}
        characters={charactersProductHunt}
        bgColor={"bg-[#ff6154]"}
        src="data:image/png;base64,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"
        positionClass="bottom-4 left-4 md:bottom-6 md:left-6"
      />
    </>
  );
};

export default FloatingLabel;
