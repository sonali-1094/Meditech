import React, { useEffect, useState } from "react";
import "./PublicHealth.css";

const PublicHealth = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/latest?apikey=pub_f025b74f6e174b1f817fe9bb011b7be7&q=public%20health%20awareness&language=en`
        );
        const data = await response.json();
        console.log(data); // helpful debug
        setArticles(data.results); // ✅ Fix here
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="public-health">
      <h2>📢 Public Health Awareness</h2>
      {articles.length === 0 ? (
        <p>Loading health news...</p>
      ) : (
        articles.map((item, index) => (
          <div className="article" key={index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              Read More →
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default PublicHealth;
