import React, { useState, useEffect, useRef } from "react";
import Gravity, { MatterBody } from "./components/gravity";
import CountdownTimer from "./components/countdown-timer";
import { generateUniqueElements, getRandomNumber } from "./utils";
import BackgroundText from "./components/background-text";

const App = () => {
  const elements = generateUniqueElements();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    console.log("first");
    if (scrollContainerRef.current) {
      const scrollPosition = scrollContainerRef.current.scrollTop;
      setIsScrolled(scrollPosition > window.innerHeight);
    }
  };
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // console.log("first")
  return (
    <div
      ref={scrollContainerRef}
      style={{
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Physics Layer */}
      <div
  className="fixed inset-0 bg-[#BF00FF]"  // A vibrant hot pink/red
  style={{ zIndex: isScrolled ? 0 : 1 }}
>
        <BackgroundText />
        <div className="absolute inset-0">
          <Gravity
            gravity={{ x: 0, y: 0.5 }}
            resetOnResize={true}
            addTopWall={true}
          >
            <MatterBody x="50" y="50">
              <CountdownTimer />
            </MatterBody>
            {elements.map((element, index) => (
              <MatterBody
                key={index}
                x={`${getRandomNumber(10, 90)}`}
                y="10" // Random negative values for staggered falling
              >
                {element}
              </MatterBody>
            ))}
          </Gravity>
        </div>
      </div>

      {/* Scrollable Content */}
      <div>
        <div style={{ height: "100vh" }} />

        <div style={{ zIndex: 2 }}>
          <div className="bg-white/90 backdrop-blur-sm">
            <div className="h-[100px] text-center flex items-center justify-center">
              <h2 className="text-2xl font-bold">Hello</h2>
            </div>
            <div className="max-w-4xl mx-auto p-8">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Section 1</h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Section 2</h3>
                <p className="text-gray-600">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Section 3</h3>
                <p className="text-gray-600">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>
            <footer className="bg-gray-800 text-white text-center py-8">
              <div className="max-w-4xl mx-auto px-4">
                <p className="mb-4">
                  &copy; 2025 Your Company Name. All rights reserved.
                </p>
                <div className="flex justify-center space-x-6">
                  <a href="#" className="hover:text-gray-300">
                    Terms
                  </a>
                  <a href="#" className="hover:text-gray-300">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-gray-300">
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
