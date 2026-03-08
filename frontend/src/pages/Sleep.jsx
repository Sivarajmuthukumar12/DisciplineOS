import { useState, useEffect } from "react";
import axios from "axios";

function Sleep({ user }) {
  const [logs, setLogs] = useState([]);
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [quality, setQuality] = useState(7);
  const [message, setMessage] = useState("");

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const r = await axios.get(`http://localhost:5000/sleep/${user.id}`);
      setLogs(r.data);
    } catch {}
  };

  const calcDuration = (sleep, wake) => {
    if (!sleep || !wake) return null;
    const [sh, sm] = sleep.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);
    let mins = (wh * 60 + wm) - (sh * 60 + sm);
    if (mins < 0) mins += 24 * 60;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const getQualityColor = (q) => {
    if (q >= 8) return "#00ff88";
    if (q >= 5) return "#ffaa00";
    return "#ff4444";
  };

  const addLog = async () => {
    if (!sleepTime || !wakeTime) { setMessage("Please fill sleep and wake time!"); return; }
    await axios.post("http://localhost:5000/sleep", { user_id: user.id, sleep_time: sleepTime, wake_time: wakeTime, quality });
    setMessage("Sleep logged! 😴");
    setTimeout(() => setMessage(""), 3000);
    setSleepTime(""); setWakeTime(""); setQuality(7);
    fetchLogs();
  };

  return (
    <div style={{ color: "white", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#aa00ff", marginBottom: "0.5rem" }}>😴 Sleep Tracker</h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}>Track your sleep patterns for better recovery</p>

      {/* Log Sleep */}
      <div style={{ backgroundColor: "#111", padding: "1.5rem", borderRadius: "16px", border: "1px solid #222", marginBottom: "2rem" }}>
        <h2 style={{ color: "#fff", marginBottom: "1rem", fontSize: "1.1rem" }}>🌙 Log Sleep</h2>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "140px" }}>
            <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>😴 Sleep Time</label>
            <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: "140px" }}>
            <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>☀️ Wake Time</label>
            <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>
          Sleep Quality: <span style={{ color: getQualityColor(quality) }}>{quality}/10</span>
        </label>
        <input type="range" min="1" max="10" value={quality} onChange={e => setQuality(Number(e.target.value))}
          style={{ width: "100%", marginBottom: "1rem", accentColor: "#aa00ff" }} />

        {message && <p style={{ color: "#aa00ff", marginBottom: "1rem", fontSize: "0.9rem" }}>{message}</p>}
        <button onClick={addLog} style={{ ...buttonStyle, backgroundColor: "#aa00ff" }}>Log Sleep</button>
      </div>

      {/* Sleep History */}
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>📅 Recent Sleep ({logs.length} entries)</h2>
      {logs.length === 0 ? (
        <div style={{ backgroundColor: "#111", padding: "2rem", borderRadius: "16px", border: "1px solid #222", textAlign: "center", color: "#555" }}>
          No sleep logs yet! Log your first night above. 🌙
        </div>
      ) : (
        logs.map(log => (
          <div key={log.id} style={{
            backgroundColor: "#111", padding: "1rem 1.5rem", borderRadius: "12px",
            border: "1px solid #aa00ff33", marginBottom: "0.75rem",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <p style={{ color: "white", margin: 0, fontWeight: "500" }}>
                😴 {log.sleep_time} → ☀️ {log.wake_time}
              </p>
              <p style={{ color: "#555", margin: "0.2rem 0 0 0", fontSize: "0.85rem" }}>
                Duration: <span style={{ color: "#aa00ff" }}>{calcDuration(log.sleep_time, log.wake_time)}</span>
                {" • "}{log.logged_at}
              </p>
            </div>
            <div style={{
              backgroundColor: `${getQualityColor(log.quality)}22`,
              color: getQualityColor(log.quality),
              padding: "0.4rem 0.8rem", borderRadius: "8px",
              fontWeight: "bold", fontSize: "0.9rem"
            }}>
              {log.quality}/10
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

export default Sleep;