import React from "react";
import "./Emergency.css";

const Emergency = () => {
  const handleSOS = () => {
    alert("🚨 SOS Activated!\nAn alert has been sent to your emergency contacts.");
  };

  return (
    <div className="footer">

      <div className="emergency-container">
        <h4>📞 Emergency Numbers</h4>
        <p><strong>India:</strong> 112 (General), 102 (Ambulance)</p>
        <p><strong>Mental Health:</strong> 9152987821</p>
        <button className="sos-button" onClick={handleSOS}>🚨 SOS</button>
      </div>
    </div>
  );
};

export default Emergency;
