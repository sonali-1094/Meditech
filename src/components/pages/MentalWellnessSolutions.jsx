import React, { useState, useEffect } from "react";
import { askClaude, parseClaudeJson } from "../../services/claude";
import "./MentalWellnessSolutions.css";

const solutions = {
  anxiety: {
    title: "😰 Anxiety",
    description: "Feeling worried, nervous, or uneasy? Here are proven techniques to help you calm down.",
    color: "#f59e0b",
    techniques: [
      {
        name: "4-7-8 Breathing",
        steps: ["Breathe in through nose for 4 seconds", "Hold for 7 seconds", "Exhale slowly for 8 seconds", "Repeat 3-4 times"],
        icon: "🌬️"
      },
      {
        name: "Grounding Exercise",
        steps: ["Notice 5 things you can see", "Notice 4 things you can touch", "Notice 3 things you can hear", "Notice 2 things you can smell", "Notice 1 thing you can taste"],
        icon: "🎯"
      },
      {
        name: "Body Scan",
        steps: ["Sit comfortably and close eyes", "Focus on your toes, then feet", "Move attention up slowly", "Notice any tension without judging", "Release tension with each exhale"],
        icon: "🧘"
      },
      {
        name: "Journaling",
        steps: ["Write down what's worrying you", "Ask yourself: Will this matter in 5 years?", "List 3 things that are going right", "Write 1 thing you're grateful for"],
        icon: "📝"
      }
    ],
    helplines: [
      { name: "Mental Health Helpline", number: "1-800-xxx-xxxx" },
      { name: "Crisis Text Line", number: "Text HOME to 741741" }
    ]
  },
  depression: {
    title: "😔 Depression",
    description: "Feeling sad, hopeless, or lacking energy? These strategies can help lift your mood.",
    color: "#6366f1",
    techniques: [
      {
        name: "Activity Scheduling",
        steps: ["Start with one small task", "Break tasks into smaller steps", "Celebrate each completion", "Gradually increase activity"],
        icon: "📅"
      },
      {
        name: "Cognitive Reframing",
        steps: ["Notice negative thoughts", "Ask: Is this 100% true?", "Find evidence for and against", "Create a balanced thought"],
        icon: "🔄"
      },
      {
        name: "Behavioral Activation",
        steps: ["Do one pleasant activity", "Even 5 minutes helps", "Connect with someone", "Get some sunlight"],
        icon: "☀️"
      },
      {
        name: "Self-Compassion",
        steps: ["Place hand on heart", "Say: This is hard right now", "Remember impermanence", "Offer yourself kindness"],
        icon: "💕"
      }
    ],
    helplines: [
      { name: "Depression Helpline", number: "1-800-xxx-xxxx" },
      { name: "Samaritans", number: "116 123" }
    ]
  },
  loneliness: {
    title: "😞 Loneliness",
    description: "Feeling isolated or disconnected? Building connections takes time. Start small.",
    color: "#ec4899",
    techniques: [
      {
        name: "Reach Out",
        steps: ["Send a text to someone", "Call a family member", "Join an online community", "Say hello to a neighbor"],
        icon: "📱"
      },
      {
        name: "Pet Therapy",
        steps: ["Spend time with pets", "Consider adopting", "Visit animal shelter", "Watch animal videos"],
        icon: "🐕"
      },
      {
        name: "Volunteer",
        steps: ["Help others in need", "Join local groups", "Share your skills", "Meet like-minded people"],
        icon: "🤝"
      },
      {
        name: "Online Communities",
        steps: ["Join support groups", "Participate in forums", "Share your story", "Connect with others"],
        icon: "🌐"
      }
    ],
    helplines: [
      { name: "Samaritans", number: "116 123" },
      { name: "Mind", number: "0300 123 3393" }
    ]
  },
  stress: {
    title: "😓 Stress",
    description: "Feeling overwhelmed? These techniques can help you manage and reduce stress.",
    color: "#14b8a6",
    techniques: [
      {
        name: "Time Management",
        steps: ["Make a to-do list", "Prioritize tasks", "Take breaks", "Learn to say no"],
        icon: "⏰"
      },
      {
        name: "Progressive Relaxation",
        steps: ["Tense muscles for 5 seconds", "Release and notice the change", "Work through body parts", "Do this daily"],
        icon: "💆"
      },
      {
        name: "Nature Break",
        steps: ["Go outside for 10 minutes", "Notice 3 things in nature", "Feel the breeze on skin", "Listen to birds"],
        icon: "🌳"
      },
      {
        name: "Music Therapy",
        steps: ["Create a calm playlist", "Listen to relaxing music", "Try singing or dancing", "Use as a break"],
        icon: "🎵"
      }
    ],
    helplines: [
      { name: "Stress Helpline", number: "1-800-xxx-xxxx" }
    ]
  }
};

const MentalWellnessSolutions = () => {
  const [activeCategory, setActiveCategory] = useState("anxiety");
  const [activeTechnique, setActiveTechnique] = useState(null);
  const [showHelplines, setShowHelplines] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("inhale");
  const [breathCount, setBreathCount] = useState(4);
  const [selectedMood, setSelectedMood] = useState("");
  const [supportPlan, setSupportPlan] = useState(null);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportError, setSupportError] = useState("");

  // Breathing exercise
  useEffect(() => {
    const timer = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          if (breathingPhase === "inhale") {
            setBreathingPhase("hold");
            return 4;
          } else if (breathingPhase === "hold") {
            setBreathingPhase("exhale");
            return 4;
          } else {
            setBreathingPhase("inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [breathingPhase]);

  const getBreathText = () => {
    if (breathingPhase === "inhale") return "Breathe In...";
    if (breathingPhase === "hold") return "Hold...";
    return "Breathe Out...";
  };

  const getSupportPlan = async () => {
    setSupportLoading(true);
    setSupportError("");
    setSupportPlan(null);

    try {
      const category = solutions[activeCategory];
      const text = await askClaude({
        maxTokens: 800,
        system:
          "You are a warm mental wellness support assistant. You are not a therapist. Give practical grounding steps, encourage support, and include crisis guidance for self-harm or danger.",
        prompt: `Create a short mental wellness support plan. Return only valid JSON with keys: opening, rightNow, nextHour, today, supportReminder, crisisNote. The rightNow, nextHour, and today keys must be arrays with 3 short items each.\n\nCurrent focus: ${category.title}\nDescription: ${category.description}\nSelected mood: ${selectedMood || "not selected"}`
      });
      setSupportPlan(parseClaudeJson(text));
    } catch (error) {
      setSupportError("Claude support is unavailable right now. You can still use the built-in exercises below.");
      console.error(error);
    } finally {
      setSupportLoading(false);
    }
  };

  return (
    <div className="solutions-container">
      <div className="solutions-header">
        <h2>🧠 Mental Wellness Solutions</h2>
        <p>Feeling alone, anxious, or down? You're not alone. Here are tools and techniques to help you feel better.</p>
      </div>

      {/* Quick Breathing Exercise */}
      <div className="breathing-widget">
        <h3>🌬️ Quick Calm Down Exercise</h3>
        <div className={`breathing-circle ${breathingPhase}`}>
          <span className="breath-text">{getBreathText()}</span>
          <span className="breath-count">{breathCount}</span>
        </div>
        <p className="breathing-instruction">Follow the circle - breathe in, hold, breathe out</p>
      </div>

      {/* Category Selection */}
      <div className="category-tabs">
        {Object.entries(solutions).map(([key, data]) => (
          <button
            key={key}
            className={`category-tab ${activeCategory === key ? "active" : ""}`}
            style={{'--category-color': data.color}}
            onClick={() => { setActiveCategory(key); setActiveTechnique(null); }}
          >
            <span className="tab-icon">{data.title.split(" ")[0]}</span>
            <span className="tab-title">{data.title.split(" ")[1]}</span>
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="category-description" style={{borderColor: solutions[activeCategory].color}}>
        <h3>{solutions[activeCategory].title}</h3>
        <p>{solutions[activeCategory].description}</p>
        <button className="support-plan-btn" type="button" onClick={getSupportPlan}>
          Get Claude Support Plan
        </button>
      </div>

      {(supportLoading || supportError || supportPlan) && (
        <div className="support-plan">
          <h3>Claude Support Plan</h3>
          {supportLoading && <p>Creating a gentle plan for this moment...</p>}
          {supportError && <p className="ai-error">{supportError}</p>}
          {supportPlan && (
            <>
              <p>{supportPlan.opening}</p>
              <div className="support-plan-grid">
                <div>
                  <h4>Right Now</h4>
                  <ul>
                    {supportPlan.rightNow?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Next Hour</h4>
                  <ul>
                    {supportPlan.nextHour?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Today</h4>
                  <ul>
                    {supportPlan.today?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="support-reminder">{supportPlan.supportReminder}</p>
              <p className="crisis-note">{supportPlan.crisisNote}</p>
            </>
          )}
        </div>
      )}

      {/* Techniques Grid */}
      <div className="techniques-grid">
        {solutions[activeCategory].techniques.map((technique, idx) => (
          <div
            key={idx}
            className={`technique-card ${activeTechnique === idx ? "active" : ""}`}
            onClick={() => setActiveTechnique(activeTechnique === idx ? null : idx)}
          >
            <span className="technique-icon">{technique.icon}</span>
            <h4>{technique.name}</h4>
            <span className="expand-hint">{activeTechnique === idx ? "Click to close" : "Click for steps"}</span>
            
            {activeTechnique === idx && (
              <div className="technique-steps">
                <ol>
                  {technique.steps.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Helplines */}
      <div className="helpline-section">
        <button 
          className="helpline-toggle"
          onClick={() => setShowHelplines(!showHelplines)}
        >
          📞 Need Immediate Help? Click Here
        </button>
        
        {showHelplines && (
          <div className="helpline-cards">
            <div className="helpline-card emergency">
              <h4>🆘 Crisis Support</h4>
              <p>If you're in crisis or need immediate help:</p>
              <ul>
                {solutions[activeCategory].helplines.map((line, idx) => (
                  <li key={idx}>
                    <strong>{line.name}:</strong> {line.number}
                  </li>
                ))}
              </ul>
              <p className="helpline-note">These helplines are available 24/7</p>
            </div>
          </div>
        )}
      </div>

      {/* Daily Check-in */}
      <div className="daily-checkin">
        <h3>📝 Daily Check-in</h3>
        <p>How are you feeling right now?</p>
        <div className="mood-selector">
          {["😊 Good", "😐 Okay", "😔 Low", "😰 Anxious", "😡 Frustrated"].map((mood) => (
            <button
              key={mood}
              className={`mood-btn ${selectedMood === mood ? "active" : ""}`}
              onClick={() => setSelectedMood(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <div className="encouragement">
        <p>💚 Remember: It's okay to not be okay. Asking for help is a sign of strength, not weakness. You are not alone.</p>
      </div>
    </div>
  );
};

export default MentalWellnessSolutions;
