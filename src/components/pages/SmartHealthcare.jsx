import React, { useEffect, useMemo, useState } from "react";
import { meditechAi } from "../../services/meditechAi";
import "./SmartHealthcare.css";

const defaultMetrics = {
  age: 35,
  bmi: 24,
  systolic: 120,
  diastolic: 80,
  glucose: 95,
  activity: 90,
  sleep: 7,
  stress: 5,
  smoker: false,
};

const symptomOptions = [
  "fever",
  "cough",
  "fatigue",
  "chest pain",
  "shortness of breath",
  "headache",
  "dizziness",
  "rash",
  "anxiety",
  "excessive thirst",
];

const fallbackMessage =
  "Start the Flask backend on port 5000 to use live ML predictions. The page is ready for the API.";

const SmartHealthcare = () => {
  const [symptoms, setSymptoms] = useState(["fever", "cough"]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [moodText, setMoodText] = useState("I feel anxious and tired but I am trying to manage it.");
  const [chatInput, setChatInput] = useState("How can I understand my risk score?");
  const [reportText, setReportText] = useState("Glucose 118 mg/dL, Hemoglobin 11.4 g/dL, Cholesterol 212 mg/dL, BP 138/86.");
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState({ status: "checking", models: {} });

  const scoreBands = useMemo(() => results.healthScore?.bands || [], [results.healthScore]);
  const loadedModelCount = Object.values(apiStatus.models || {}).filter(Boolean).length;

  useEffect(() => {
    let isMounted = true;

    meditechAi.health()
      .then((data) => {
        if (isMounted) {
          setApiStatus(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setApiStatus({ status: "offline", models: {} });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateMetric = (key, value) => {
    setMetrics((current) => ({
      ...current,
      [key]: key === "smoker" ? value : Number(value),
    }));
  };

  const toggleSymptom = (symptom) => {
    setSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
  };

  const addCustomSymptom = () => {
    const value = customSymptom.trim().toLowerCase();
    if (value && !symptoms.includes(value)) {
      setSymptoms((current) => [...current, value]);
    }
    setCustomSymptom("");
  };

  const runAction = async (key, action) => {
    setLoading(key);
    setError("");
    try {
      const data = await action();
      setResults((current) => ({ ...current, [key]: data }));
      return data;
    } catch (err) {
      setError(err.message || fallbackMessage);
      console.error(err);
      return null;
    } finally {
      setLoading("");
    }
  };

  const runDiseaseFlow = async () => {
    const disease = await runAction("disease", () => meditechAi.predictDisease({ symptoms, ...metrics }));
    if (disease) {
      runAction("doctors", () =>
        meditechAi.recommendDoctors({ symptoms, condition: disease.prediction })
      );
    }
  };

  const runRiskFlow = async () => {
    const risk = await runAction("risk", () => meditechAi.predictRisk(metrics));
    await runAction("healthScore", () => meditechAi.healthScore({ metrics }));
    await runAction("recommendations", () =>
      meditechAi.recommendations({ metrics, riskLevel: risk?.riskLevel })
    );
  };

  return (
    <div className="smart-healthcare">
      <section className="smart-hero">
        <div>
          <span className="eyebrow">AI powered care intelligence</span>
          <h1>Smart healthcare assistant</h1>
          <p>
            Predict disease categories, analyze mood, review reports, estimate health risk,
            recommend doctors, and turn metrics into a practical care plan.
          </p>
        </div>
        <div className="score-orbit" aria-label="Health score preview">
          <strong>{results.healthScore?.score || 82}</strong>
          <span>{results.healthScore?.grade || "Ready"}</span>
        </div>
      </section>

      <section className="ai-status-strip" aria-label="AI service status">
        <div>
          <span>API</span>
          <strong className={apiStatus.status === "offline" ? "offline" : ""}>
            {apiStatus.status === "offline" ? "Offline" : apiStatus.status}
          </strong>
        </div>
        <div>
          <span>ML models</span>
          <strong>{loadedModelCount}/3 loaded</strong>
        </div>
        <div>
          <span>Mongo logging</span>
          <strong>{apiStatus.mongo ? "Connected" : "Optional"}</strong>
        </div>
      </section>

      {error && <div className="ai-alert">{error}</div>}

      <section className="ai-grid two-col">
        <div className="ai-panel">
          <div className="panel-title">
            <span>Disease Prediction</span>
            <button type="button" onClick={runDiseaseFlow} disabled={loading === "disease"}>
              {loading === "disease" ? "Running" : "Predict"}
            </button>
          </div>
          <div className="symptom-pills">
            {symptomOptions.map((symptom) => (
              <button
                type="button"
                className={symptoms.includes(symptom) ? "selected" : ""}
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
              >
                {symptom}
              </button>
            ))}
          </div>
          <div className="inline-control">
            <input
              value={customSymptom}
              onChange={(event) => setCustomSymptom(event.target.value)}
              placeholder="Add symptom"
            />
            <button type="button" onClick={addCustomSymptom}>Add</button>
          </div>
          {results.disease && (
            <div className="result-block">
              <strong>{results.disease.prediction}</strong>
              <span>{Math.round(results.disease.confidence * 100)}% confidence, {results.disease.urgency} priority</span>
              <ul>
                {results.disease.nextSteps?.map((step) => <li key={step}>{step}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="ai-panel">
          <div className="panel-title">
            <span>Mental Health Sentiment</span>
            <button
              type="button"
              onClick={() => runAction("sentiment", () => meditechAi.analyzeSentiment({ text: moodText }))}
              disabled={loading === "sentiment"}
            >
              {loading === "sentiment" ? "Reading" : "Analyze"}
            </button>
          </div>
          <textarea value={moodText} onChange={(event) => setMoodText(event.target.value)} />
          {results.sentiment && (
            <div className="result-block">
              <strong>{results.sentiment.sentiment}</strong>
              <span>{Math.round(results.sentiment.confidence * 100)}% confidence</span>
              <ul>
                {results.sentiment.supportPlan?.map((step) => <li key={step}>{step}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="ai-panel risk-dashboard">
        <div className="panel-title">
          <span>Health Risk Prediction Dashboard</span>
          <button type="button" onClick={runRiskFlow} disabled={loading === "risk"}>
            {loading === "risk" ? "Calculating" : "Update Analytics"}
          </button>
        </div>
        <div className="metric-grid">
          <label>Age<input type="number" value={metrics.age} onChange={(event) => updateMetric("age", event.target.value)} /></label>
          <label>BMI<input type="number" value={metrics.bmi} onChange={(event) => updateMetric("bmi", event.target.value)} /></label>
          <label>Systolic<input type="number" value={metrics.systolic} onChange={(event) => updateMetric("systolic", event.target.value)} /></label>
          <label>Diastolic<input type="number" value={metrics.diastolic} onChange={(event) => updateMetric("diastolic", event.target.value)} /></label>
          <label>Glucose<input type="number" value={metrics.glucose} onChange={(event) => updateMetric("glucose", event.target.value)} /></label>
          <label>Activity min/week<input type="number" value={metrics.activity} onChange={(event) => updateMetric("activity", event.target.value)} /></label>
          <label>Sleep hours<input type="number" value={metrics.sleep} onChange={(event) => updateMetric("sleep", event.target.value)} /></label>
          <label>Stress 1-10<input type="number" min="1" max="10" value={metrics.stress} onChange={(event) => updateMetric("stress", event.target.value)} /></label>
          <label className="check-row"><input type="checkbox" checked={metrics.smoker} onChange={(event) => updateMetric("smoker", event.target.checked)} /> Smoker</label>
        </div>

        <div className="analytics-row">
          <div className="risk-meter">
            <span style={{ width: `${results.risk?.riskScore || 34}%` }}></span>
          </div>
          <div>
            <strong>{results.risk?.riskLevel || "pending"}</strong>
            <p>{results.risk ? `${results.risk.riskScore}/100 predicted health risk` : "Run analytics to calculate risk."}</p>
          </div>
        </div>

        {results.risk?.drivers?.length > 0 && (
          <div className="insight-row">
            {results.risk.drivers.map((driver) => (
              <span key={driver}>{driver}</span>
            ))}
          </div>
        )}

        <div className="band-grid">
          {scoreBands.map((band) => (
            <div className="band-card" key={band.label}>
              <span>{band.label}</span>
              <div><i style={{ height: `${Math.max(8, band.value)}%` }}></i></div>
              <strong>{band.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="ai-grid two-col">
        <div className="ai-panel">
          <div className="panel-title">
            <span>Medical Report Analyzer</span>
            <button
              type="button"
              onClick={() => runAction("report", () => meditechAi.analyzeReport({ reportText }))}
              disabled={loading === "report"}
            >
              {loading === "report" ? "Analyzing" : "Analyze Report"}
            </button>
          </div>
          <textarea value={reportText} onChange={(event) => setReportText(event.target.value)} />
          {results.report && (
            <div className="result-block">
              <strong>{results.report.summary}</strong>
              <ul>
                {results.report.flags?.map((flag) => <li key={flag}>{flag}</li>)}
              </ul>
              <div className="mini-metrics">
                {Object.entries(results.report.extractedMetrics || {}).map(([key, value]) => (
                  <span key={key}>{key}: {value}</span>
                ))}
              </div>
              <ul>
                {results.report.recommendations?.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>

        <div className="ai-panel">
          <div className="panel-title">
            <span>AI Chatbot</span>
            <button
              type="button"
              onClick={() => runAction("chat", () => meditechAi.chat({ message: chatInput, metrics }))}
              disabled={loading === "chat"}
            >
              {loading === "chat" ? "Thinking" : "Ask"}
            </button>
          </div>
          <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} />
          {results.chat && (
            <div className="chat-reply">
              <span>{results.chat.intent}</span>
              <p>{results.chat.reply}</p>
            </div>
          )}
        </div>
      </section>

      <section className="ai-grid two-col">
        <div className="ai-panel">
          <div className="panel-title">
            <span>Smart Doctor Recommendations</span>
          </div>
          {results.doctors ? (
            <>
              <p className="muted">Recommended specialty: {results.doctors.specialty}</p>
              <div className="doctor-reco-list">
                {results.doctors.doctors?.map((doctor) => (
                  <article key={doctor.name}>
                    <strong>{doctor.name}</strong>
                    <span>{doctor.specialization}</span>
                    <small>{doctor.rating} rating, {doctor.availability}</small>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p className="muted">Run disease prediction to match a specialist.</p>
          )}
        </div>

        <div className="ai-panel">
          <div className="panel-title">
            <span>Personalized Health Recommendations</span>
          </div>
          <ul className="recommendation-list">
            {(results.recommendations?.recommendations || results.risk?.recommendations || [
              "Run analytics to generate a personalized care plan.",
            ]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default SmartHealthcare;
