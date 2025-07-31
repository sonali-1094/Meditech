import React, { useState } from "react";

const Anonymouschat = () => {
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "You", text: input };
    const botMsg = {
      sender: "AI",
      text: "Thanks for sharing. You're not alone 💛",
    };

    setChats([...chats, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="widget-card">
      <h3>🗨️ Anonymous Support Chat</h3>
      <div className="chat-box">
        {chats.map((chat, idx) => (
          <div key={idx} className={`chat-msg ${chat.sender === "You" ? "user" : "bot"}`}>
            <strong>{chat.sender}:</strong> {chat.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Anonymouschat;
