import { useState } from "react";
import Login from "./pages/Login";
import Habits from "./pages/Habits";
import Sleep from "./pages/Sleep";
import Fitness from "./pages/Fitness";
import Dashboard from "./pages/Dashboard";
import BMI from "./pages/BMI";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "habits", label: "Habits", icon: "📋" },
  { id: "sleep", label: "Sleep", icon: "😴" },
  { id: "fitness", label: "Fitness", icon: "🏃" },
  { id: "bmi", label: "Calculators", icon: "⚖️" },
];

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Top Nav */}
      <div style={{
        backgroundColor: "#111",
        borderBottom: "1px solid #222",
        padding: "0 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <h2 style={{ color: "#00ff88", margin: 0, padding: "1rem 0", fontSize: "1.3rem" }}>
          🔥 DisciplineOS
        </h2>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              padding: "0.5rem 1rem",
              backgroundColor: page === item.id ? "#00ff88" : "transparent",
              color: page === item.id ? "#0a0a0a" : "#888",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: page === item.id ? "bold" : "normal",
              fontSize: "0.9rem",
              transition: "all 0.2s"
            }}>
              {item.icon} {item.label}
            </button>
          ))}
          <div style={{ width: "1px", height: "24px", backgroundColor: "#333", margin: "0 0.5rem" }} />
          <span style={{ color: "#888", fontSize: "0.85rem" }}>👤 {user.name}</span>
          <button onClick={() => setUser(null)} style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.85rem"
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Pages */}
      <div style={{ padding: "2rem" }}>
        {page === "dashboard" && <Dashboard user={user} onNavigate={setPage} />}
        {page === "habits" && <Habits user={user} />}
        {page === "sleep" && <Sleep user={user} />}
        {page === "fitness" && <Fitness user={user} />}
        {page === "bmi" && <BMI />}
      </div>
    </div>
  );
}

export default App;