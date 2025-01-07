import React, { useEffect } from "react";
import Gravity, { MatterBody } from "./components/gravity";
import CountdownTimer from "./components/countdown-timer";
import {
  generateRandomElement,
  generateUniqueElements,
  getRandomNumber,
} from "./utils";
import BackgroundText from "./components/background-text";

const App = () => {
  

  const elements = generateUniqueElements();
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black w-full h-screen">
      <BackgroundText />
      <Gravity>
        <MatterBody x="50%" y="10%">
          <CountdownTimer />
        </MatterBody>
        {elements.map((element, index) => (
          <MatterBody key={index}>{element}</MatterBody>
        ))}
      </Gravity>
    </div>
  );
};

export default App;
