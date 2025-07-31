import React, { useState } from "react";
import "./HealthRecords.css";

const HealthRecords = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  return (
    <div className="record-container">
      <h2>📁 Upload Your Health Records</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <ul>
        {files.map((file, idx) => (
          <li key={idx}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HealthRecords;
