import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (isSignup && !name)) {
      setMessage("Please fill in all fields!");
      return;
    }
    setLoading(true);
    try {
      const url = isSignup ? "http://localhost:5000/signup" : "http://localhost:5000/login";
      const data = isSignup ? { name, email, password } : { email, password };
      const response = await axios.post(url, data);
      setMessage(response.data.message);
      if (response.data.success) onLogin(response.data.user);
    } catch {
      setMessage("Something went wrong. Try again!");
    }
    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: "#0a0a0a",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        backgroundColor: "#111",
        padding: "2.5rem",
        borderRadius: "20px",
        border: "1px solid #222",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 0 40px rgba(0,255,136,0.05)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem" }}>🔥</div>
          <h1 style={{ color: "#00ff88", margin: "0.5rem 0", fontSize: "2rem" }}>DisciplineOS</h1>
          <p style={{ color: "#555", margin: 0 }}>
            {isSignup ? "Start your discipline journey" : "Welcome back, warrior"}
          </p>
        </div>

        {isSignup && (
          <input type="text" placeholder="Your Name" value={name}
            onChange={e => setName(e.target.value)} style={inputStyle} />
        )}
        <input type="email" placeholder="Email Address" value={email}
          onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={inputStyle} />

        {message && (
          <p style={{ color: message.includes("wrong") || message.includes("Invalid") || message.includes("exists") ? "#ff4444" : "#00ff88", textAlign: "center", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {message}
          </p>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          ...buttonStyle, opacity: loading ? 0.7 : 1
        }}>
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
        </button>

        <p onClick={() => { setIsSignup(!isSignup); setMessage(""); }}
          style={{ color: "#555", textAlign: "center", marginTop: "1.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
          {isSignup ? "Already have an account? " : "No account? "}
          <span style={{ color: "#00ff88" }}>{isSignup ? "Login" : "Sign up free"}</span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.9rem", marginBottom: "1rem",
  backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "10px",
  color: "white", fontSize: "1rem", boxSizing: "border-box", outline: "none"
};

const buttonStyle = {
  width: "100%", padding: "0.9rem", backgroundColor: "#00ff88",
  color: "#0a0a0a", border: "none", borderRadius: "10px",
  fontSize: "1rem", fontWeight: "bold", cursor: "pointer"
};

export default Login;