import React, { useState } from "react";

const tasks = [
  "Take 3 deep breaths",
  "Write 1 thing you're grateful for",
  "Go for a 5-min walk",
  "Drink a glass of water",
];

const DailyExercises = () => {
  const [completed, setCompleted] = useState([]);

  const toggleTask = (index) => {
    if (completed.includes(index)) {
      setCompleted(completed.filter((i) => i !== index));
    } else {
      setCompleted([...completed, index]);
    }
  };

  return (
    <div className="widget-card">
      <h3>🧘 Daily Wellness Exercises</h3>
      <ul>
        {tasks.map((task, i) => (
          <li key={i}>
            <label>
              <input
                type="checkbox"
                checked={completed.includes(i)}
                onChange={() => toggleTask(i)}
              />
              {task}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyExercises;
