import { useState, useEffect } from "react";
import axios from "axios";

const WORKOUT_TYPES = ["Running", "Walking", "Cycling", "Swimming", "Gym", "Yoga", "HIIT", "Other"];

function Fitness({ user }) {
  const [logs, setLogs] = useState([]);
  const [steps, setSteps] = useState("");
  const [workoutType, setWorkoutType] = useState("Running");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const r = await axios.get(`https://545c5a61d61404af-171-79-51-180.serveousercontent.com/fitness/${user.id}`);
      setLogs(r.data);
    } catch {}
  };

  const addLog = async () => {
    if (!steps && !duration) { setMessage("Please enter steps or workout duration!"); return; }
    await axios.post("https://545c5a61d61404af-171-79-51-180.serveousercontent.com/fitness", {
      user_id: user.id, steps: Number(steps) || 0,
      workout_type: workoutType, duration: Number(duration) || 0,
      calories: Number(calories) || Math.round((Number(duration) || 0) * 7)
    });
    setMessage("Workout logged! 💪");
    setTimeout(() => setMessage(""), 3000);
    setSteps(""); setDuration(""); setCalories("");
    fetchLogs();
  };

  const totalSteps = logs.reduce((sum, l) => sum + (l.steps || 0), 0);
  const totalCalories = logs.reduce((sum, l) => sum + (l.calories || 0), 0);

  return (
    <div style={{ color: "white", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#00aaff", marginBottom: "0.5rem" }}>🏃 Fitness Tracker</h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}>Track your workouts and stay active</p>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {[
          { label: "Total Steps (7 days)", value: totalSteps.toLocaleString(), icon: "👟", color: "#00aaff" },
          { label: "Total Calories", value: totalCalories.toLocaleString(), icon: "🔥", color: "#ff6600" },
          { label: "Workouts Logged", value: logs.length, icon: "💪", color: "#00ff88" },
        ].map(card => (
          <div key={card.label} style={{
            backgroundColor: "#111", padding: "1.2rem", borderRadius: "12px",
            border: `1px solid ${card.color}22`, flex: 1, minWidth: "140px"
          }}>
            <div style={{ fontSize: "1.5rem" }}>{card.icon}</div>
            <div style={{ color: card.color, fontSize: "1.5rem", fontWeight: "bold" }}>{card.value}</div>
            <div style={{ color: "#555", fontSize: "0.8rem" }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Log Workout */}
      <div style={{ backgroundColor: "#111", padding: "1.5rem", borderRadius: "16px", border: "1px solid #222", marginBottom: "2rem" }}>
        <h2 style={{ color: "#fff", marginBottom: "1rem", fontSize: "1.1rem" }}>💪 Log Workout</h2>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "140px" }}>
            <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>👟 Steps</label>
            <input type="number" placeholder="e.g. 8000" value={steps}
              onChange={e => setSteps(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: "140px" }}>
            <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>⏱️ Duration (mins)</label>
            <input type="number" placeholder="e.g. 45" value={duration}
              onChange={e => setDuration(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "140px" }}>
            <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>🏋️ Workout Type</label>
            <select value={workoutType} onChange={e => setWorkoutType(e.target.value)} style={inputStyle}>
              {WORKOUT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "140px" }}>
            <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>🔥 Calories Burned</label>
            <input type="number" placeholder="Auto-estimated if empty" value={calories}
              onChange={e => setCalories(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {message && <p style={{ color: "#00aaff", marginBottom: "1rem", fontSize: "0.9rem" }}>{message}</p>}
        <button onClick={addLog} style={{ ...buttonStyle, backgroundColor: "#00aaff" }}>Log Workout</button>
      </div>

      {/* History */}
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>📅 Recent Workouts</h2>
      {logs.length === 0 ? (
        <div style={{ backgroundColor: "#111", padding: "2rem", borderRadius: "16px", border: "1px solid #222", textAlign: "center", color: "#555" }}>
          No workouts yet! Log your first session above. 🏃
        </div>
      ) : (
        logs.map(log => (
          <div key={log.id} style={{
            backgroundColor: "#111", padding: "1rem 1.5rem", borderRadius: "12px",
            border: "1px solid #00aaff33", marginBottom: "0.75rem",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <p style={{ color: "white", margin: 0, fontWeight: "500" }}>
                🏋️ {log.workout_type} • ⏱️ {log.duration} mins
              </p>
              <p style={{ color: "#555", margin: "0.2rem 0 0 0", fontSize: "0.85rem" }}>
                👟 {log.steps?.toLocaleString() || 0} steps •
                🔥 {log.calories} cal •
                <span style={{ color: "#00aaff" }}> {log.logged_at}</span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.8rem", marginBottom: "1rem",
  backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "8px",
  color: "white", fontSize: "1rem", boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%", padding: "0.8rem", backgroundColor: "#00ff88",
  color: "white", border: "none", borderRadius: "8px",
  fontSize: "1rem", fontWeight: "bold", cursor: "pointer"
};

export default Fitness;