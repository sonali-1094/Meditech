import React, { useState } from "react";
import "./Mentalwellness.css";

const moods = ["😊 Happy", "😐 Okay", "😢 Sad", "😡 Angry", "😰 Anxious"];

const Mentalwellness = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  return (
    <div className="mental-container">
      <h2>Mental Wellness</h2>

      <section className="mood-section">
        <h3>How are you feeling today?</h3>
        <div className="mood-buttons">
          {moods.map((mood) => (
            <button
              key={mood}
              className={`mood-btn ${selectedMood === mood ? "active" : ""}`}
              onClick={() => setSelectedMood(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
        {selectedMood && <p className="selected-mood">You feel: {selectedMood}</p>}
      </section>

      <section className="chat-section">
        <h3>Anonymous Chat</h3>
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="chat-form">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </section>
    </div>
  );
};

export default Mentalwellness;
