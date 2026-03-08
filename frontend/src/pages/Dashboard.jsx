import { useState, useEffect } from "react";
import axios from "axios";

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      backgroundColor: "#111", padding: "1.5rem", borderRadius: "16px",
      border: `1px solid ${color}22`, flex: 1, minWidth: "150px"
    }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ color: color, fontSize: "2rem", fontWeight: "bold" }}>{value}</div>
      <div style={{ color: "#555", fontSize: "0.85rem", marginTop: "0.25rem" }}>{label}</div>
    </div>
  );
}

function Dashboard({ user, onNavigate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`https://disciplineos-backend.onrender.com/dashboard/${user.id}`)
      .then(r => setStats(r.data))
      .catch(() => {});
  }, [user.id]);

  const quickActions = [
    { label: "📋 Log Habit", page: "habits", color: "#00ff88" },
    { label: "😴 Log Sleep", page: "sleep", color: "#aa00ff" },
    { label: "🏃 Log Workout", page: "fitness", color: "#00aaff" },
    { label: "⚖️ BMI Check", page: "bmi", color: "#ffaa00" },
  ];

  return (
    <div style={{ color: "white", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "#00ff88", marginBottom: "0.5rem" }}>
        Good day, {user.name}! 👋
      </h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}>
        Here's your discipline overview
      </p>

      {/* Stats */}
      {stats && (
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <StatCard icon="📋" label="Total Habits" value={stats.total_habits} color="#00ff88" />
          <StatCard icon="🔥" label="Best Streak" value={`${stats.best_streak} days`} color="#ff6600" />
          <StatCard icon="✅" label="Completions" value={stats.total_completions} color="#00aaff" />
          <StatCard icon="👟" label="Today's Steps" value={stats.today_steps.toLocaleString()} color="#ffaa00" />
        </div>
      )}

      {/* Quick Actions */}
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>⚡ Quick Actions</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {quickActions.map(action => (
          <button key={action.page} onClick={() => onNavigate(action.page)} style={{
            padding: "1rem 1.5rem", backgroundColor: "#111",
            color: action.color, border: `1px solid ${action.color}44`,
            borderRadius: "12px", cursor: "pointer", fontSize: "1rem",
            fontWeight: "bold", transition: "all 0.2s"
          }}>
            {action.label}
          </button>
        ))}
      </div>

      {/* Motivation */}
      <div style={{
        backgroundColor: "#111", padding: "1.5rem", borderRadius: "16px",
        border: "1px solid #00ff8822"
      }}>
        <h3 style={{ color: "#00ff88", margin: "0 0 0.5rem 0" }}>💬 Daily Reminder</h3>
        <p style={{ color: "#888", margin: 0, fontStyle: "italic" }}>
          "Discipline is doing what needs to be done, even when you don't want to do it."
        </p>
      </div>
    </div>
  );
}

export default Dashboard;