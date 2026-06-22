import React, { useEffect, useState } from "react";
import { askClaude, parseClaudeJson } from "../../services/claude";
import "./HealthAssistant.css";

const healthInfo = {
  fever: {
    title: "Fever (High Body Temperature)",
    simple: "Fever means your body is fighting an infection. It's like your body's security system working hard!",
    symptoms: ["Feeling hot", "Sweating", "Headache", "Body aches"],
    whatToDo: [
      "Drink plenty of water",
      "Rest in a cool, comfortable place",
      "Take fever-reducing medicine if needed",
      "See a doctor if fever lasts more than 3 days"
    ],
    whenToSeekHelp: "If temperature is above 103°F (39.4°C) or you have difficulty breathing"
  },
  cough: {
    title: "Cough",
    simple: "Cough is your body's way to clear your throat and airways. It can be due to cold, allergies, or other reasons.",
    symptoms: ["Throat irritation", "Mucus (phlegm)", "Chest discomfort", "Shortness of breath"],
    whatToDo: [
      "Drink warm fluids like water or tea",
      "Avoid smoking or polluted areas",
      "Use honey (for adults) to soothe throat",
      "Get plenty of rest"
    ],
    whenToSeekHelp: "If cough lasts more than 2 weeks or you see blood"
  },
  headache: {
    title: "Headache",
    simple: "Headache is pain in your head. It can be caused by stress, lack of sleep, dehydration, or being sick.",
    symptoms: ["Pain in forehead or temples", "Sensitivity to light", "Nausea", "Dizziness"],
    whatToDo: [
      "Rest in a quiet, dark room",
      "Drink water - you might be dehydrated",
      "Take pain relievers if needed",
      "Practice deep breathing"
    ],
    whenToSeekHelp: "If headache is severe or accompanied by high fever or confusion"
  },
  stomachPain: {
    title: "Stomach Pain",
    simple: "Stomach pain can have many causes - from eating something bad to stress. Your stomach is telling you something!",
    symptoms: ["Pain in belly area", "Nausea", "Bloating", "Loss of appetite"],
    whatToDo: [
      "Rest and avoid heavy food",
      "Drink clear fluids",
      "Avoid dairy temporarily",
      "Try a warm compress on stomach"
    ],
    whenToSeekHelp: "If pain is severe, you have blood in stool, or cannot keep food down"
  },
  cold: {
    title: "Common Cold",
    simple: "Cold is a viral infection that affects your nose and throat. It's very common and usually mild.",
    symptoms: ["Runny or stuffy nose", "Sneezing", "Sore throat", "Mild cough"],
    whatToDo: [
      "Drink warm fluids",
      "Get plenty of rest",
      "Use steam to clear nose",
      "Eat nutritious food"
    ],
    whenToSeekHelp: "If symptoms worsen or don't improve in 10 days"
  },
  fatigue: {
    title: "Fatigue (Tiredness)",
    simple: "Fatigue means feeling very tired and having no energy. It can be due to lack of sleep, stress, or health issues.",
    symptoms: ["Constant tiredness", "Difficulty concentrating", "Muscle weakness", "Sleep problems"],
    whatToDo: [
      "Get 7-9 hours of sleep",
      "Eat balanced meals",
      "Exercise regularly",
      "Manage stress"
    ],
    whenToSeekHelp: "If tiredness persists despite rest"
  }
};

const HealthAssistant = () => {
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [claudeGuide, setClaudeGuide] = useState(null);
  const [claudeLoading, setClaudeLoading] = useState(false);
  const [claudeError, setClaudeError] = useState("");

  const filteredConditions = Object.keys(healthInfo).filter((key) =>
    healthInfo[key].title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!selectedCondition) return;

    const loadClaudeGuide = async () => {
      const condition = healthInfo[selectedCondition];
      setClaudeGuide(null);
      setClaudeError("");
      setClaudeLoading(true);

      try {
        const text = await askClaude({
          maxTokens: 800,
          system:
            "You are a patient-friendly health education assistant. Do not diagnose or prescribe. Explain common health topics simply and include clear warning signs.",
          prompt: `Create an enhanced guide for this health topic. Return only valid JSON with keys: simpleExplanation, commonReasons, homeCare, avoid, redFlags, doctorPrep. Each array should contain 3 to 5 short items.\n\nTopic: ${JSON.stringify(condition)}`
        });
        setClaudeGuide(parseClaudeJson(text));
      } catch (error) {
        setClaudeError("Claude enhancement is unavailable right now. The built-in guide is still shown below.");
        console.error(error);
      } finally {
        setClaudeLoading(false);
      }
    };

    loadClaudeGuide();
  }, [selectedCondition]);

  return (
    <div className="health-assistant">
      <div className="assistant-header">
        <h2>🤖 AI Health Guide</h2>
        <p>Select a symptom or condition to learn what it means in simple language</p>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search symptoms (e.g., fever, cough, headache)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="condition-grid">
        {filteredConditions.map((key) => (
          <button
            key={key}
            className={`condition-card ${selectedCondition === key ? "active" : ""}`}
            onClick={() => setSelectedCondition(key)}
          >
            <span className="condition-icon">
              {key === "fever" && "🌡️"}
              {key === "cough" && "😷"}
              {key === "headache" && "🤕"}
              {key === "stomachPain" && "🤢"}
              {key === "cold" && "🤧"}
              {key === "fatigue" && "😴"}
            </span>
            <span className="condition-name">{healthInfo[key].title}</span>
          </button>
        ))}
      </div>

      {selectedCondition && (
        <div className="info-panel">
          <div className="claude-guide">
            <h3>Claude Enhanced Guide</h3>
            {claudeLoading && <p>Asking Claude for a clearer explanation...</p>}
            {claudeError && <p className="ai-error">{claudeError}</p>}
            {claudeGuide && (
              <>
                <p>{claudeGuide.simpleExplanation}</p>
                <div className="guide-grid">
                  <div>
                    <h4>Common Reasons</h4>
                    <ul>
                      {claudeGuide.commonReasons?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Home Care</h4>
                    <ul>
                      {claudeGuide.homeCare?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Avoid</h4>
                    <ul>
                      {claudeGuide.avoid?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Red Flags</h4>
                    <ul>
                      {claudeGuide.redFlags?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {claudeGuide.doctorPrep?.length > 0 && (
                  <div className="doctor-prep">
                    <h4>Before You See a Doctor</h4>
                    <ul>
                      {claudeGuide.doctorPrep.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="simple-explanation">
            <h3>💡 In Simple Terms</h3>
            <p>{healthInfo[selectedCondition].simple}</p>
          </div>

          <div className="symptoms-section">
            <h3>🔍 Common Symptoms</h3>
            <ul>
              {healthInfo[selectedCondition].symptoms.map((symptom, idx) => (
                <li key={idx}>{symptom}</li>
              ))}
            </ul>
          </div>

          <div className="what-to-do">
            <h3>✅ What You Can Do</h3>
            <ol>
              {healthInfo[selectedCondition].whatToDo.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>

          <div className="seek-help">
            <h3>🏥 When to See a Doctor</h3>
            <p>{healthInfo[selectedCondition].whenToSeekHelp}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthAssistant;
