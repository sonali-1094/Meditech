import React from "react";
import "./pages/Mentalhealth.css";

import Anoymouschat from "./mentalhealth/Anoymouschat";
import Breathing from "./mentalhealth/Breathing";
import DailyExercises from "./mentalhealth/DailyExercises";
import Quotes from "./mentalhealth/Quotes";

const Mentalhealth = () => {
  return (
    <div className="mental-container">
      <h2>🧠 Mental Health Support</h2>

      <div className="mental-widgets">
        <DailyExercises />
        <Quotes />
        <Breathing />
        <Anoymouschat />
      </div>
    </div>
  );
};

export default Mentalhealth;
