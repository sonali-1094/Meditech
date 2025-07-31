import React, { useState, useEffect } from "react";


const Breathing = () => {
  const [step, setStep] = useState("Inhale");
  const [time, setTime] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          if (step === "Inhale") {
            setStep("Hold");
            return 2;
          } else if (step === "Hold") {
            setStep("Exhale");
            return 4;
          } else {
            setStep("Inhale");
            return 3;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="widget-card">
      <h3>🧘 Breathing Exercise</h3>
      <h2>{step}</h2>
      <p>{time} seconds</p>
      <div className="count-circle">{}</div>

    </div>
  );
};

export default Breathing;
