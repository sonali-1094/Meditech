import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DoctorList from "./components/pages/DoctorList";
import MentalHealth from "./components/Mentalhealth";
import Mentalwellness from "./components/pages/Mentalwellness";
import PublicHealth from "./components/pages/PublicHealth";
import HealthRecords from "./components/pages/HealthRecords";
import Emergency from "./components/pages/Emergency";
import HealthAssistant from "./components/pages/HealthAssistant";
import HealthEducation from "./components/pages/HealthEducation";
import SymptomChecker from "./components/pages/SymptomChecker";
import MentalWellnessSolutions from "./components/pages/MentalWellnessSolutions";
import SmartHealthcare from "./components/pages/SmartHealthcare";

const features = [
  {
    icon: "AI",
    title: "Smart AI Assistant",
    description: "Predictions, report analysis, risk scoring, doctor matching, and personalized next steps.",
    link: "/smart-healthcare",
    color: "#2563eb"
  },
  {
    icon: "SC",
    title: "Symptom Checker",
    description: "Answer quick questions and turn uncertainty into a practical care direction.",
    link: "/symptom-checker",
    color: "#0f9f8f"
  },
  {
    icon: "LE",
    title: "Learn Health",
    description: "Short, readable education for prevention, daily care, and public health topics.",
    link: "/health-education",
    color: "#7c3aed"
  },
  {
    icon: "MW",
    title: "Mental Wellness",
    description: "Breathing, exercises, reflections, and supportive tools for emotional balance.",
    link: "/mental-solutions",
    color: "#db2777"
  },
  {
    icon: "HR",
    title: "My Health Records",
    description: "Keep reports, visits, notes, and reminders organized on your own device.",
    link: "/health-records",
    color: "#d97706"
  },
  {
    icon: "ER",
    title: "Emergency",
    description: "Fast access to urgent support, warning signs, and emergency contacts.",
    link: "/emergency",
    color: "#dc2626"
  }
];

const healthSignals = [
  { label: "Hydration", value: "82%", tone: "steady" },
  { label: "Sleep Goal", value: "7.5h", tone: "calm" },
  { label: "Risk Check", value: "Low", tone: "good" }
];

const careTimeline = [
  { time: "Now", title: "Run a symptom screen", detail: "3-minute check for fever, cough, pain, fatigue, and breathing." },
  { time: "Today", title: "Update health records", detail: "Add lab notes, prescriptions, or recent vitals after a visit." },
  { time: "Weekly", title: "Mental reset", detail: "Use breathing and wellness tools to build a repeatable care habit." }
];

function App() {
  return (
    <Router>
      <Navbar />

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="hero-section">
                  <div className="hero-copy">
                    <span className="eyebrow">Connected personal care workspace</span>
                    <h1 className="hero-title">Meditech makes everyday health decisions clearer.</h1>
                    <p className="hero-subtitle">
                      A practical health hub for symptoms, records, education, mental wellness, and emergency readiness.
                    </p>
                    <div className="hero-actions">
                      <a className="primary-action" href="/smart-healthcare">Start AI Check</a>
                      <a className="secondary-action" href="/health-records">Open Records</a>
                    </div>
                    <div className="trust-row" aria-label="Platform highlights">
                      <span>Private browser storage</span>
                      <span>Simple language guidance</span>
                      <span>Emergency-first access</span>
                    </div>
                  </div>

                  <div className="hero-dashboard" aria-label="Meditech care dashboard preview">
                    <div className="dashboard-topline">
                      <span>Care Snapshot</span>
                      <strong>Today</strong>
                    </div>
                    <div className="pulse-panel">
                      <div>
                        <span className="panel-label">Readiness score</span>
                        <strong>91</strong>
                      </div>
                      <div className="pulse-ring">
                        <span></span>
                      </div>
                    </div>
                    <div className="signal-grid">
                      {healthSignals.map((signal) => (
                        <div className={`signal-card ${signal.tone}`} key={signal.label}>
                          <span>{signal.label}</span>
                          <strong>{signal.value}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="next-care">
                      <span className="panel-label">Suggested next step</span>
                      <p>Review symptoms if anything changed, then add notes to records for continuity.</p>
                    </div>
                  </div>
                </div>

                <section className="care-strip" aria-label="Quick care actions">
                  <a href="/emergency">
                    <strong>Emergency</strong>
                    <span>Urgent help and danger signs</span>
                  </a>
                  <a href="/health-guide">
                    <strong>Explain a condition</strong>
                    <span>Understand symptoms in simple words</span>
                  </a>
                  <a href="/mental-solutions">
                    <strong>Reset your mind</strong>
                    <span>Breathing and wellness exercises</span>
                  </a>
                </section>

                <div className="features-grid">
                  {features.map((feature, index) => (
                    <a href={feature.link} key={index} className="feature-card" style={{'--accent-color': feature.color}}>
                      <span className="feature-icon">{feature.icon}</span>
                      <h3 className="feature-title">{feature.title}</h3>
                      <p className="feature-description">{feature.description}</p>
                      <span className="feature-arrow">-&gt;</span>
                    </a>
                  ))}
                </div>

                <div className="quick-tips-section">
                  <div className="section-heading">
                    <span className="eyebrow">Personal care rhythm</span>
                    <h2>Small actions that make the app useful every day</h2>
                  </div>
                  <div className="care-timeline">
                    {careTimeline.map((item) => (
                      <article className="timeline-item" key={item.title}>
                        <span>{item.time}</span>
                        <h3>{item.title}</h3>
                        <p>{item.detail}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </>
            }
          />
          <Route path="/mental-wellness" element={<Mentalwellness />} />
          <Route path="/mental-solutions" element={<MentalWellnessSolutions />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/awareness" element={<PublicHealth />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/health-guide" element={<HealthAssistant />} />
          <Route path="/health-education" element={<HealthEducation />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/smart-healthcare" element={<SmartHealthcare />} />


          </Routes>
      </main>
      

      <Footer />
    </Router>
  );
}

export default App;
