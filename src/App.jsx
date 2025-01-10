import React, { useState, useEffect, useRef } from "react";
import Gravity, { MatterBody } from "./components/gravity";
import CountdownTimer from "./components/countdown-timer";
import { generateUniqueElements, getRandomNumber } from "./utils";
import BackgroundText from "./components/background-text";
import FloatingLabel from "./components/FloatingLable";

const App = () => {
  const elements = generateUniqueElements();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [windowSize, setWindowSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollPosition = scrollContainerRef.current.scrollTop;
      setIsScrolled(scrollPosition > window.innerHeight);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };

    // Set initial size
    handleResize();
    
    // Wait for a brief moment to ensure all components are properly mounted
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    window.addEventListener("resize", handleResize);
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      clearTimeout(timer);
    };
  }, []);

  const getRandomPosition = () => {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    switch (side) {
      case 0: // top
        x = getRandomNumber(0, 100);
        y = -10;
        break;
      case 1: // right
        x = 110;
        y = getRandomNumber(0, 100);
        break;
      case 2: // bottom
        x = getRandomNumber(0, 100);
        y = 110;
        break;
      case 3: // left
        x = -10;
        y = getRandomNumber(0, 100);
        break;
    }
    return { x: `${x}`, y: `${y}` };
  };

  if (!isReady) {
    return null; // or a loading spinner
  }

  return (
    <div
      ref={scrollContainerRef}
      style={{
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <div
        className="fixed inset-0 bg-gradient-to-t from-green-300 to-green-500"
        style={{ zIndex: isScrolled ? 0 : 1 }}
      >
        <BackgroundText />
        <div className="absolute inset-0">
          <Gravity
            gravity={{ x: 0, y: 1.5 }}
            resetOnResize={true}
            addTopWall={true}
          >
            <MatterBody x="50" y="50">
              <CountdownTimer />
            </MatterBody>
            {elements.map((element, index) => {
              const position = getRandomPosition();
              return (
                <MatterBody key={index} x={position.x} y={position.y}>
                  {element}
                </MatterBody>
              );
            })}
          </Gravity>
        </div>
      </div>
      <div>
        <div style={{ height: "100vh" }} />
        <div style={{ zIndex: 2 }}>{/* ... rest of your content ... */}</div>
      </div>
      <FloatingLabel />
    </div>
  );
};

export default App;