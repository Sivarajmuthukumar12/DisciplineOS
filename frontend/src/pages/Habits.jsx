import { useState, useEffect } from "react";
import axios from "axios";

const CATEGORIES = ["Health", "Fitness", "Nutrition", "Sleep", "Habit Elimination"];
const COLORS = {
  Health: "#00ff88", Fitness: "#00aaff",
  Nutrition: "#ffaa00", Sleep: "#aa00ff", "Habit Elimination": "#ff4444"
};

function Habits({ user }) {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [category, setCategory] = useState("Health");
  const [message, setMessage] = useState("");

  useEffect(() => { fetchHabits(); }, []);

  const fetchHabits = async () => {
    try {
      const r = await axios.get(`https://545c5a61d61404af-171-79-51-180.serveousercontent.com/habits/${user.id}`);
      setHabits(r.data);
    } catch {}
  };

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(""), 3000); };

  const addHabit = async () => {
    if (!habitName.trim()) { showMsg("Please enter a habit name!"); return; }
    await axios.post("https://545c5a61d61404af-171-79-51-180.serveousercontent.com/habits", { user_id: user.id, name: habitName, category });
    setHabitName("");
    showMsg("Habit added! 🎉");
    fetchHabits();
  };

  const completeHabit = async (id) => {
    await axios.post("https://545c5a61d61404af-171-79-51-180.serveousercontent.com/habits/complete", { habit_id: id });
    showMsg("Habit completed! 🔥 Streak increased!");
    fetchHabits();
  };

  const deleteHabit = async (id) => {
    await axios.delete(`https://545c5a61d61404af-171-79-51-180.serveousercontent.com/habits/${id}`);
    showMsg("Habit removed!");
    fetchHabits();
  };

  return (
    <div style={{ color: "white", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff88", marginBottom: "0.5rem" }}>📋 Habit Tracker</h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}>Build discipline one habit at a time</p>

      {/* Add Habit */}
      <div style={{ backgroundColor: "#111", padding: "1.5rem", borderRadius: "16px", border: "1px solid #222", marginBottom: "2rem" }}>
        <h2 style={{ color: "#fff", marginBottom: "1rem", fontSize: "1.1rem" }}>➕ Add New Habit</h2>
        <input type="text" placeholder="e.g. Wake up at 6AM, No junk food..." value={habitName}
          onChange={e => setHabitName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addHabit()}
          style={inputStyle} />
        <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        {message && <p style={{ color: "#00ff88", marginBottom: "1rem", fontSize: "0.9rem" }}>{message}</p>}
        <button onClick={addHabit} style={buttonStyle}>Add Habit</button>
      </div>

      {/* Habits List */}
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>🔥 Your Habits ({habits.length})</h2>
      {habits.length === 0 ? (
        <div style={{ backgroundColor: "#111", padding: "2rem", borderRadius: "16px", border: "1px solid #222", textAlign: "center", color: "#555" }}>
          No habits yet! Add your first habit above. 💪
        </div>
      ) : (
        habits.map(habit => (
          <div key={habit.id} style={{
            backgroundColor: "#111", padding: "1rem 1.5rem", borderRadius: "12px",
            border: `1px solid ${COLORS[habit.category] || "#333"}33`,
            marginBottom: "0.75rem", display: "flex",
            justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <p style={{ color: "white", margin: 0, fontSize: "1rem", fontWeight: "500" }}>{habit.name}</p>
              <p style={{ color: COLORS[habit.category] || "#888", margin: "0.2rem 0 0 0", fontSize: "0.8rem" }}>
                {habit.category} • 🔥 {habit.streak} day streak
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => completeHabit(habit.id)} style={{
                padding: "0.5rem 1rem", backgroundColor: "#00ff8820",
                color: "#00ff88", border: "1px solid #00ff8844",
                borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "0.85rem"
              }}>✅ Done</button>
              <button onClick={() => deleteHabit(habit.id)} style={{
                padding: "0.5rem 0.75rem", backgroundColor: "#ff444420",
                color: "#ff4444", border: "1px solid #ff444444",
                borderRadius: "8px", cursor: "pointer"
              }}>🗑️</button>
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
  color: "#0a0a0a", border: "none", borderRadius: "8px",
  fontSize: "1rem", fontWeight: "bold", cursor: "pointer"
};

export default Habits;