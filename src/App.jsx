import React, { useState, useEffect, useRef } from "react";
import Gravity, { MatterBody } from "./components/gravity";
import CountdownTimer from "./components/countdown-timer";
import { generateUniqueElements, getRandomNumber } from "./utils";
import BackgroundText from "./components/background-text";
import FloatingLabel from "./components/FloatingLable";
import ReactConfetti from "react-confetti";

const App = () => {
  const elements = generateUniqueElements();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isTimerMounted, setIsTimerMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const scrollContainerRef = useRef(null);
  const gravityRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      // Ensure the app is ready before mounting components
      setIsReady(false);

      // Simulate initialization delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsReady(true);

      // Delay mounting of the timer to ensure gravity is initialized
      setTimeout(() => setIsTimerMounted(true), 100);
    };

    initializeApp();

    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollPosition = scrollContainerRef.current.scrollTop;
        setIsScrolled(scrollPosition > window.innerHeight);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    console.log(`
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠛⠛⠙⠉⠉⠉⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿   
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⣠⣶⣾⣿⣿⣧⣿⣿⣿⣶⣤⡀⠀⠀⠉⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣟⡇⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⡘⠙⢁⣉⡻⣿⣿⢏⣉⣉⣭⣀⡙⣆⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⣴⠟⠋⠉⠛⢸⣟⠀⠉⠄⠀⠉⢻⣾⠀⡘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⣿⣤⡶⢂⣠⣾⣾⡞⢿⣧⣽⣿⣿⣿⠈⢦⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢰⢏⣿⣿⣿⡧⠺⢿⠟⠎⡿⣿⣿⣏⡻⠈⡁⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠌⣿⣿⢏⠳⢂⡀⢡⠋⠏⠈⣿⡟⡙⣄⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⡹⣿⣆⣤⣆⣤⣥⣢⣴⣶⠿⡽⢳⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠗⠙⣿⣿⣿⣾⣿⣿⣷⣿⡿⣍⠘⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⣶⢭⣋⠛⢙⡋⣀⣬⠞⣼⡄⠀⠀⠀⠉⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⢹⣷⣾⣿⣿⣿⣿⣶⣿⣿⣧⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠐⢀⡜⢿⣿⣿⣿⣿⣿⣿⣿⡿⣣⠃⡞⠀⠀⠀⠀⠀⠈⠉⠛⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⣿⣿⠟⠋⠉⠀⠀⠀⠀⠀⠀⠀⠘⢿⢷⣽⣻⠿⢿⠿⣻⣵⢾⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿
    ⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⢿⣿⣷⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠘⣿⣿⣿⣿⣿⣿
    ⣿⡏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⢹⣿⣿⣿⣿⣿⣿
    ⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀   ⢿⣿⣿⣿⣿⣿
    ⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀   ⠸⣿⣿⣿⣿⣿
    ⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀   ⠀⢿⣿⣿⣿⣿
    ⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀     ⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⢸⣿⣿⣿

    Developed By: Darshit Dudhaiya & Sanjay Tomar  
    
    "Crafting code, solving problems, and sharing knowledge."
    
    🌐 \x1b[4mConnect with us:\x1b[0m  
    
    🔗 LinkedIn: https://www.linkedin.com/in/darshitdudhaiya/  
    🔗 LinkedIn: https://www.linkedin.com/in/sanjay-tomar/
    💻 GitHub: https://github.com/darshitdudhaiya
    🐦 X (Twitter): https://x.com/darshitdudhaiya
    
    `);
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const getRandomPosition = () => {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    switch (side) {
      case 0:
        x = getRandomNumber(0, 100);
        y = -10;
        break;
      case 1:
        x = 110;
        y = getRandomNumber(0, 100);
        break;
      case 2:
        x = getRandomNumber(0, 100);
        y = 110;
        break;
      case 3:
        x = -10;
        y = getRandomNumber(0, 100);
        break;
      default:
        x = 50;
        y = 50;
    }
    return { x: `${x}`, y: `${y}` };
  };

  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-t from-green-300 to-green-500">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
      </div>
    );
  }

  const handleExclamationClick = () => {
    setShowConfetti(true);
  };

  const stopConfetti = () => {
    setShowConfetti(false);
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
        <BackgroundText onExclamationClick={handleExclamationClick} stopConfetti={stopConfetti} />
        <div className="absolute inset-0">
          <Gravity
            ref={gravityRef}
            gravity={{ x: 0, y: 0.5 }}
            resetOnResize={true}
            addTopWall={true}
            autoStart={true}
          >
            {isTimerMounted && (
              <MatterBody
                x="50"
                y="50"
                matterBodyOptions={{
                  friction: 0.1,
                  restitution: 0.6,
                  density: 0.001,
                  isStatic: false,
                  slop: 0.05,
                  frictionStatic: 0.5,
                  frictionAir: 0.001,
                }}
              >
                <CountdownTimer />
              </MatterBody>
            )}
            {elements.map((element, index) => {
              const position = getRandomPosition();
              return (
                <MatterBody
                  key={index}
                  x={position.x}
                  y={position.y}
                  matterBodyOptions={{
                    friction: 0.1,
                    restitution: 0.6,
                    density: 0.001,
                    isStatic: false,
                    slop: 0.05,
                    frictionStatic: 0.5,
                    frictionAir: 0.001,
                  }}
                >
                  {element}
                </MatterBody>
              );
            })}
            {showConfetti && (
              <MatterBody
                x="50"
                y="50"
                matterBodyOptions={{
                  isStatic: true,
                }}
              >
                <ReactConfetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  gravity={0.1}
                  initialVelocityX={2}
                  initialVelocityY={2}
                  numberOfPieces={200}
                  opacity={1}
                  recycle
                  run
                />
              </MatterBody>
            )}
          </Gravity>
        </div>
      </div>
      <div>
        <div style={{ height: "100vh" }} />
        <div style={{ zIndex: 2 }}>
          {/* Additional content here which is not available for now */}
        </div>
      </div>
      <FloatingLabel />
    </div>
  );
};

export default App;
