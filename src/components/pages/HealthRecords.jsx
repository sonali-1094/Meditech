import React, { useState, useEffect } from "react";
import "./HealthRecords.css";

const HealthRecords = () => {
  const [files, setFiles] = useState([]);
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: "",
    date: "",
    type: "",
    notes: ""
  });
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Load records from local storage on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem("healthRecords");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save records to local storage
  useEffect(() => {
    localStorage.setItem("healthRecords", JSON.stringify(records));
  }, [records]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleInputChange = (e) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRecord.title && newRecord.date && newRecord.type) {
      const record = {
        ...newRecord,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setRecords([record, ...records]);
      setNewRecord({ title: "", date: "", type: "", notes: "" });
      setShowForm(false);
      generateSuggestion(record);
    }
  };

  const deleteRecord = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  // AI-based health suggestions based on record types
  const generateSuggestion = (record) => {
    const suggestions = {
      "Blood Test": {
        icon: "🩸",
        title: "Blood Test Results",
        tips: [
          "Make sure to fast for 8-12 hours before blood tests",
          "Stay hydrated - it makes vein finding easier",
          "Bring a snack for after the test",
          "Ask your doctor to explain abnormal results"
        ],
        followUp: "Schedule a follow-up appointment to discuss results with your doctor within 1 week of receiving them."
      },
      "Blood Pressure": {
        icon: "❤️",
        title: "Blood Pressure Monitoring",
        tips: [
          "Measure at the same time each day for consistency",
          "Avoid caffeine and exercise for 30 minutes before measuring",
          "Sit quietly for 5 minutes before checking",
          "Use the correct cuff size for accurate readings"
        ],
        followUp: "If your readings are consistently above 140/90, consult your doctor about managing blood pressure."
      },
      "Sugar Test": {
        icon: "🍬",
        title: "Blood Sugar Monitoring",
        tips: [
          "Test before meals and at bedtime",
          "Keep a log of your readings to identify patterns",
          "Maintain consistent meal times",
          "Exercise regularly to help control sugar levels"
        ],
        followUp: "For fasting sugar above 126 mg/dL or random sugar above 200 mg/dL, consult your doctor about diabetes management."
      },
      "X-Ray": {
        icon: "📷",
        title: "X-Ray / Imaging",
        tips: [
          "Remove jewelry and metal objects before the scan",
          "Wear loose, comfortable clothing",
          "Follow any specific preparation instructions",
          "Ask about radiation safety if pregnant"
        ],
        followUp: "Discuss results with your doctor within 3-5 days of the procedure."
      },
      "Vaccination": {
        icon: "💉",
        title: "Vaccination Record",
        tips: [
          "Keep a vaccination card in a safe place",
          "Note any side effects you experience",
          "Stay for 15-30 minutes after vaccination for monitoring",
          "Keep vaccinations up to date"
        ],
        followUp: "Schedule booster shots as recommended by your healthcare provider."
      },
      "General Checkup": {
        icon: "🩺",
        title: "General Health Checkup",
        tips: [
          "Prepare a list of questions for your doctor",
          "Bring previous medical records if visiting new doctor",
          "Fast if required for blood tests",
          "Don't hide any symptoms from your doctor"
        ],
        followUp: "Schedule annual checkups even if you feel healthy."
      }
    };

    const suggestion = suggestions[record.type];
    if (suggestion) {
      setAiSuggestion({ ...suggestion, recordTitle: record.title });
      // Auto-hide suggestion after 10 seconds
      setTimeout(() => setAiSuggestion(null), 10000);
    }
  };

  const recordTypes = [
    "Blood Test",
    "Blood Pressure",
    "Sugar Test",
    "X-Ray",
    "Vaccination",
    "General Checkup"
  ];

  return (
    <div className="record-container">
      <div className="record-header">
        <h2>📁 My Health Records</h2>
        <p>Store and manage your health documents in one place</p>
      </div>

      {/* AI Suggestion Panel */}
      {aiSuggestion && (
        <div className="ai-suggestion">
          <button className="close-suggestion" onClick={() => setAiSuggestion(null)}>✕</button>
          <div className="suggestion-header">
            <span className="suggestion-icon">{aiSuggestion.icon}</span>
            <h3>💡 AI Health Tip: {aiSuggestion.title}</h3>
          </div>
          <div className="suggestion-tips">
            <h4>What to do:</h4>
            <ul>
              {aiSuggestion.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="suggestion-followup">
            <h4>📅 Next Step:</h4>
            <p>{aiSuggestion.followUp}</p>
          </div>
        </div>
      )}

      {/* File Upload Section */}
      <div className="upload-section">
        <h3>📎 Upload Documents</h3>
        <div className="file-upload">
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
            id="fileInput"
            className="file-input"
          />
          <label htmlFor="fileInput" className="file-label">
            <span className="upload-icon">📂</span>
            <span>Click to upload or drag files here</span>
            <span className="file-types">PDF, JPG, PNG (Max 10MB)</span>
          </label>
        </div>
        {files.length > 0 && (
          <div className="file-list">
            <h4>Uploaded Files:</h4>
            <ul>
              {files.map((file, idx) => (
                <li key={idx}>
                  <span className="file-icon">📄</span>
                  {file.name}
                  <span className="file-size">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Add New Record Button */}
      <button className="add-record-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "✕ Cancel" : "+ Add Health Record"}
      </button>

      {/* Record Entry Form */}
      {showForm && (
        <form className="record-form" onSubmit={handleSubmit}>
          <h3>Add New Health Record</h3>
          <div className="form-group">
            <label>Record Title</label>
            <input
              type="text"
              name="title"
              value={newRecord.title}
              onChange={handleInputChange}
              placeholder="e.g., Annual Checkup 2024"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Record Type</label>
              <select
                name="type"
                value={newRecord.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select type...</option>
                {recordTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={newRecord.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              value={newRecord.notes}
              onChange={handleInputChange}
              placeholder="Any additional notes..."
              rows="3"
            />
          </div>
          <button type="submit" className="submit-btn">Save Record</button>
        </form>
      )}

      {/* Records List */}
      <div className="records-list">
        <h3>📋 Your Health Records</h3>
        {records.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>No health records yet. Add your first record!</p>
          </div>
        ) : (
          <div className="records-grid">
            {records.map((record) => (
              <div key={record.id} className="record-card">
                <div className="record-type-badge">
                  {record.type === "Blood Test" && "🩸"}
                  {record.type === "Blood Pressure" && "❤️"}
                  {record.type === "Sugar Test" && "🍬"}
                  {record.type === "X-Ray" && "📷"}
                  {record.type === "Vaccination" && "💉"}
                  {record.type === "General Checkup" && "🩺"}
                  {record.type}
                </div>
                <h4>{record.title}</h4>
                <p className="record-date">📅 {record.date}</p>
                {record.notes && <p className="record-notes">{record.notes}</p>}
                <div className="record-actions">
                  <button 
                    className="get-suggestion-btn"
                    onClick={() => generateSuggestion(record)}
                  >
                    💡 Get Tip
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteRecord(record.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="storage-info">
        <p>💾 Your records are stored securely in your browser. Data stays on your device.</p>
      </div>
    </div>
  );
};

export default HealthRecords;
