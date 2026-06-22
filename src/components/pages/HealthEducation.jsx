import React, { useState } from "react";
import "./HealthEducation.css";

const healthArticles = [
  {
    id: 1,
    title: "Understanding Blood Pressure",
    category: "Heart Health",
    icon: "❤️",
    summary: "Learn what blood pressure means and why it matters for your health",
    content: {
      whatItIs: "Blood pressure is the force of blood pushing against the walls of your arteries (the tubes that carry blood from your heart to your body). Think of it like water pressure in a pipe - too high or too low can cause problems.",
      whyItMatters: "High blood pressure (also called hypertension) can damage your heart and blood vessels over time. It's often called the 'silent killer' because it usually has no symptoms but can lead to heart disease, stroke, and kidney problems.",
      normalRange: "Normal blood pressure is typically around 120/80 mmHg. The top number (systolic) measures pressure when your heart beats, and the bottom number (diastolic) measures pressure between beats.",
      tips: [
        "Reduce salt intake in your food",
        "Exercise regularly (at least 30 minutes daily)",
        "Maintain a healthy weight",
        "Limit alcohol consumption",
        "Don't smoke",
        "Manage stress through relaxation"
      ]
    }
  },
  {
    id: 2,
    title: "Diabetes: What You Need to Know",
    category: "Diabetes Care",
    icon: "🍬",
    summary: "Simple explanation of diabetes and how to manage it",
    content: {
      whatItIs: "Diabetes is a condition where your body cannot properly process sugar (glucose) from the food you eat. This happens because either your body doesn't make enough insulin (a hormone that helps sugar enter cells) or your cells don't respond to insulin well.",
      whyItMatters: "When sugar stays in your blood instead of going into your cells, it can damage your blood vessels, eyes, kidneys, and nerves over time. Proper management can prevent these complications.",
      types: "There are two main types: Type 1 (body doesn't make insulin) and Type 2 (body doesn't use insulin well). Type 2 is more common and often related to lifestyle.",
      tips: [
        "Choose whole grains over refined carbs",
        "Eat vegetables with every meal",
        "Control portion sizes",
        "Stay active - walk after meals",
        "Check your blood sugar regularly",
        "Take medications as prescribed"
      ]
    }
  },
  {
    id: 3,
    title: "Healthy Eating Made Easy",
    category: "Nutrition",
    icon: "🥗",
    summary: "Simple guide to eating healthy without confusion",
    content: {
      whatItIs: "Healthy eating means giving your body the nutrients it needs to work properly. You don't need to follow strict diets - just make better choices most of the time.",
      whyItMatters: "Good nutrition gives you energy, helps your body fight infections, keeps your heart healthy, and helps you maintain a healthy weight. It also affects your mood and mental health.",
      plateMethod: "Imagine your plate divided into sections: Half for vegetables and fruits, quarter for protein (meat, fish, eggs), quarter for carbohydrates (rice, bread, pasta).",
      tips: [
        "Drink water instead of sugary drinks",
        "Eat rainbow colors - different colored fruits and vegetables have different nutrients",
        "Read food labels - avoid items with long ingredient lists",
        "Cook at home more often",
        "Eat slowly and stop when you feel full",
        "Plan your meals ahead"
      ]
    }
  },
  {
    id: 4,
    title: "Understanding Cholesterol",
    category: "Heart Health",
    icon: "🫀",
    summary: "What is cholesterol and why is it important?",
    content: {
      whatItIs: "Cholesterol is a waxy, fat-like substance found in your blood. Your body needs some cholesterol to build healthy cells, but too much can cause problems.",
      whyItMatters: "High LDL ('bad') cholesterol can build up in your arteries, making them narrow and blocking blood flow. This can lead to heart attacks and strokes.",
      types: "There are two main types: LDL (bad) cholesterol that builds up in arteries, and HDL (good) cholesterol that helps remove bad cholesterol from your blood.",
      tips: [
        "Eat foods high in fiber like oats and beans",
        "Choose healthy fats found in nuts and olive oil",
        "Avoid trans fats (found in some processed foods)",
        "Eat fatty fish like salmon twice a week",
        "Exercise for at least 30 minutes most days",
        "Maintain a healthy weight"
      ]
    }
  },
  {
    id: 5,
    title: "Sleep: Why It Matters",
    category: "Wellness",
    icon: "😴",
    summary: "The importance of good sleep for your health",
    content: {
      whatItIs: "Sleep is when your body rests and repairs itself. During sleep, your brain processes the day's experiences, your body heals, and your energy is restored.",
      whyItMatters: "Poor sleep can affect your mood, memory, immune system, and even increase risk of heart disease, obesity, and diabetes. Adults need 7-9 hours of sleep per night.",
      tips: [
        "Go to bed and wake up at the same time daily",
        "Keep your bedroom dark and cool",
        "Avoid screens (phone, TV) before bed",
        "Limit caffeine after noon",
        "Create a relaxing bedtime routine",
        "Exercise regularly - but not too close to bedtime"
      ]
    }
  },
  {
    id: 6,
    title: "Vaccination: Protecting Yourself",
    category: "Prevention",
    icon: "💉",
    summary: "Understanding vaccines and their importance",
    content: {
      whatItIs: "Vaccines teach your immune system to recognize and fight specific diseases. They contain weakened or parts of germs that can't cause disease but help your body build protection.",
      whyItMatters: "Vaccines prevent dangerous diseases that can cause serious illness, disability, or death. They also protect others who can't be vaccinated by reducing disease spread.",
      commonVaccines: "Common vaccines include: Flu shot (yearly), COVID-19 vaccines, Tetanus booster (every 10 years), and age-specific vaccines for children and seniors.",
      tips: [
        "Keep a record of your vaccinations",
        "Ask your doctor about recommended vaccines",
        "Don't delay vaccines due to fear - they are very safe",
        "Vaccines can have mild side effects like sore arm",
        "Stay updated on COVID-19 and flu vaccines",
        "Discuss any health conditions with your doctor before vaccination"
      ]
    }
  }
];

const HealthEducation = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...new Set(healthArticles.map((a) => a.category))];

  const filteredArticles = filter === "All" 
    ? healthArticles 
    : healthArticles.filter((a) => a.category === filter);

  return (
    <div className="health-education">
      <div className="education-header">
        <h2>📚 Health Education Center</h2>
        <p>Learn about health topics in simple, easy-to-understand language</p>
      </div>

      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="articles-grid">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className={`article-card ${selectedArticle?.id === article.id ? "selected" : ""}`}
            onClick={() => setSelectedArticle(article)}
          >
            <span className="article-icon">{article.icon}</span>
            <span className="article-category">{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <div className="article-detail">
          <button className="close-btn" onClick={() => setSelectedArticle(null)}>
            ✕ Close
          </button>
          
          <div className="detail-header">
            <span className="detail-icon">{selectedArticle.icon}</span>
            <div>
              <span className="detail-category">{selectedArticle.category}</span>
              <h2>{selectedArticle.title}</h2>
            </div>
          </div>

          <div className="detail-section">
            <h3>📖 What is it?</h3>
            <p>{selectedArticle.content.whatItIs}</p>
          </div>

          <div className="detail-section">
            <h3>🎯 Why does it matter?</h3>
            <p>{selectedArticle.content.whyItMatters}</p>
          </div>

          {selectedArticle.content.types && (
            <div className="detail-section">
              <h3>📋 Types</h3>
              <p>{selectedArticle.content.types}</p>
            </div>
          )}

          {selectedArticle.content.normalRange && (
            <div className="detail-section">
              <h3>📊 Normal Range</h3>
              <p>{selectedArticle.content.normalRange}</p>
            </div>
          )}

          <div className="detail-section tips-section">
            <h3>💡 Practical Tips</h3>
            <ul>
              {selectedArticle.content.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthEducation;