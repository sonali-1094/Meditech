import React, { useState } from "react";
import { askClaude, parseClaudeJson } from "../../services/claude";
import "./SymptomChecker.css";

const symptomQuestions = {
  fever: {
    question: "Do you feel hot or have a high body temperature?",
    icon: "🌡️",
    yesMessage: "You may have a fever. This means your body is fighting an infection.",
    noMessage: "Good! No fever detected. But if you feel unwell, monitor your temperature.",
    severity: "medium"
  },
  cough: {
    question: "Are you coughing frequently or have a sore throat?",
    icon: "😷",
    yesMessage: "You might have a cough. This could be due to a cold, allergies, or irritation.",
    noMessage: "Great! No cough detected. Keep staying healthy!",
    severity: "low"
  },
  headache: {
    question: "Do you have pain in your head or feel dizzy?",
    icon: "🤕",
    yesMessage: "You have a headache. This could be due to stress, lack of sleep, or dehydration.",
    noMessage: "Good! No headache. Remember to stay hydrated and get enough sleep.",
    severity: "low"
  },
  stomach: {
    question: "Do you have stomach pain, nausea, or feel like vomiting?",
    icon: "🤢",
    yesMessage: "You might have stomach issues. This could be from something you ate or an infection.",
    noMessage: "Great! Your stomach seems fine. Eat healthy to keep it that way!",
    severity: "medium"
  },
  fatigue: {
    question: "Do you feel very tired or lack energy even after rest?",
    icon: "😴",
    yesMessage: "You might be experiencing fatigue. This could be due to lack of sleep, stress, or illness.",
    noMessage: "Excellent! You seem full of energy. Keep it up!",
    severity: "low"
  },
  breathing: {
    question: "Do you have trouble breathing or feel short of breath?",
    icon: "😮‍️",
    yesMessage: "Difficulty breathing could be serious. Please consult a doctor immediately.",
    noMessage: "Good! Your breathing seems normal.",
    severity: "high"
  }
};

const SymptomChecker = () => {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleAnswer = (symptom, answer) => {
    setAnswers({ ...answers, [symptom]: answer });
  };

  const getResult = () => {
    const yesCount = Object.values(answers).filter(a => a === "yes").length;
    const symptoms = Object.keys(answers).filter(s => answers[s] === "yes");
    
    if (yesCount === 0) {
      return {
        level: "green",
        title: "✅ You seem healthy!",
        message: "No major symptoms detected. Keep maintaining a healthy lifestyle!",
        tips: [
          "Continue eating a balanced diet",
          "Get regular exercise",
          "Stay hydrated",
          "Get enough sleep (7-9 hours)"
        ]
      };
    } else if (yesCount <= 2) {
      return {
        level: "yellow",
        title: "⚠️ Mild Symptoms Detected",
        message: "You have some symptoms that may need attention. Monitor them closely.",
        symptoms: symptoms,
        tips: [
          "Rest and stay hydrated",
          "Take over-the-counter pain relievers if needed",
          "Monitor your symptoms for 2-3 days",
          "Consult a doctor if symptoms worsen"
        ]
      };
    } else {
      return {
        level: "red",
        title: "🛑 Multiple Symptoms Detected",
        message: "You have several symptoms that may require medical attention.",
        symptoms: symptoms,
        tips: [
          "Please consult a healthcare professional",
          "Keep track of all your symptoms",
          "Rest and avoid strenuous activity",
          "Seek immediate care if symptoms are severe"
        ]
      };
    }
  };

  const resetChecker = () => {
    setAnswers({});
    setShowResult(false);
    setAiInsight(null);
    setAiError("");
  };

  const buildAnswerSummary = () =>
    Object.entries(symptomQuestions).map(([key, data]) => ({
      symptom: key,
      question: data.question,
      answer: answers[key] || "not answered",
      severity: data.severity
    }));

  const getClaudeInsight = async () => {
    const result = getResult();
    setAiLoading(true);
    setAiError("");

    try {
      const text = await askClaude({
        maxTokens: 700,
        system:
          "You are a careful health education assistant. You do not diagnose. You give safe, simple, non-alarming triage guidance and always recommend professional care for urgent symptoms.",
        prompt: `Review this symptom checker result and return only valid JSON with keys: summary, urgency, possibleCauses, actionSteps, watchFor, doctorQuestions. Each array should have 3 to 5 short items. Avoid diagnosis and include emergency warning signs when relevant.\n\nResult: ${JSON.stringify(result)}\nAnswers: ${JSON.stringify(buildAnswerSummary())}`
      });
      setAiInsight(parseClaudeJson(text));
    } catch (error) {
      setAiError("Claude guidance is unavailable right now. Showing the built-in health tips instead.");
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const showResults = () => {
    setShowResult(true);
    getClaudeInsight();
  };

  return (
    <div className="symptom-checker">
      <div className="checker-header">
        <h2>🔍 Simple Symptom Checker</h2>
        <p>Answer a few simple questions to understand your health better</p>
        <p className="disclaimer">⚠️ This is not medical advice. Always consult a doctor for proper diagnosis.</p>
      </div>

      {!showResult ? (
        <div className="questions-container">
          {Object.entries(symptomQuestions).map(([key, data]) => (
            <div key={key} className={`question-card ${answers[key] ? "answered" : ""}`}>
              <div className="question-icon">{data.icon}</div>
              <p className="question-text">{data.question}</p>
              <div className="answer-buttons">
                <button
                  className={`answer-btn yes ${answers[key] === "yes" ? "selected" : ""}`}
                  onClick={() => handleAnswer(key, "yes")}
                >
                  ✅ Yes
                </button>
                <button
                  className={`answer-btn no ${answers[key] === "no" ? "selected" : ""}`}
                  onClick={() => handleAnswer(key, "no")}
                >
                  ❌ No
                </button>
              </div>
            </div>
          ))}
          
          <button 
            className="check-result-btn"
            onClick={showResults}
            disabled={Object.keys(answers).length === 0}
          >
            Get My Results →
          </button>
        </div>
      ) : (
        <div className="result-container">
          {(() => {
            const result = getResult();
            return (
              <>
                <div className={`result-header ${result.level}`}>
                  <span className="result-icon">
                    {result.level === "green" && "✅"}
                    {result.level === "yellow" && "⚠️"}
                    {result.level === "red" && "🛑"}
                  </span>
                  <h3>{result.title}</h3>
                  <p>{result.message}</p>
                </div>

                {result.symptoms && (
                  <div className="symptom-summary">
                    <h4>Your symptoms:</h4>
                    <div className="symptom-tags">
                      {result.symptoms.map(s => (
                        <span key={s} className="symptom-tag">
                          {symptomQuestions[s].icon} {s.charAt(0).toUpperCase() + s.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="tips-section">
                  <h4>💡 Health Tips for You:</h4>
                  <ul>
                    {result.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="claude-panel">
                  <h4>Claude Personalized Guidance</h4>
                  {aiLoading && <p>Preparing a safer, more detailed care plan...</p>}
                  {aiError && <p className="ai-error">{aiError}</p>}
                  {aiInsight && (
                    <>
                      <p>{aiInsight.summary}</p>
                      <div className="claude-grid">
                        <div>
                          <h5>Urgency</h5>
                          <p>{aiInsight.urgency}</p>
                        </div>
                        <div>
                          <h5>Possible Causes</h5>
                          <ul>
                            {aiInsight.possibleCauses?.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5>Next Steps</h5>
                          <ul>
                            {aiInsight.actionSteps?.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5>Watch For</h5>
                          <ul>
                            {aiInsight.watchFor?.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {aiInsight.doctorQuestions?.length > 0 && (
                        <div className="doctor-questions">
                          <h5>Questions to Ask a Doctor</h5>
                          <ul>
                            {aiInsight.doctorQuestions.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="result-actions">
                  <button className="reset-btn" onClick={resetChecker}>
                    🔄 Start Over
                  </button>
                  <a href="/health-records" className="save-btn">
                    💾 Save to Records
                  </a>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
