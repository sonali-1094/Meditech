import React, { useEffect, useState } from "react";

const quotes = [
  "Every day may not be good, but there's something good in every day.",
  "You are stronger than you think.",
  "This too shall pass.",
  "Mental health is just as important as physical health.",
  "Healing takes time, and that’s okay.",
];

const Quotes = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const random = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[random]);
  }, []);

  return (
    <div className="widget-card">
      <h3>🧾 Quote of the Day</h3>
      <p>{quote}</p>
    </div>
  );
};

export default Quotes;
