import { useState } from "react";

function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [bmiResult, setBmiResult] = useState(null);
  const [proteinResult, setProteinResult] = useState(null);

  const calcBMI = () => {
    if (!height || !weight) return;
    const h = Number(height) / 100;
    const bmi = (Number(weight) / (h * h)).toFixed(1);
    let category = "", color = "";
    if (bmi < 18.5) { category = "Underweight"; color = "#00aaff"; }
    else if (bmi < 25) { category = "Normal weight"; color = "#00ff88"; }
    else if (bmi < 30) { category = "Overweight"; color = "#ffaa00"; }
    else { category = "Obese"; color = "#ff4444"; }
    setBmiResult({ bmi, category, color });
  };

  const calcProtein = () => {
    if (!weight || !age) return;
    const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const goalMultipliers = { lose: 1.6, maintain: 1.4, gain: 2.0, muscle: 2.2 };
    const protein = Math.round(Number(weight) * (goalMultipliers[goal] || 1.4));
    setProteinResult({ protein, goal });
  };

  return (
    <div style={{ color: "white", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#ffaa00", marginBottom: "0.5rem" }}>⚖️ Health Calculators</h1>
      <p style={{ color: "#555", marginBottom: "2rem" }}>Know your numbers, optimize your health</p>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {/* BMI Calculator */}
        <div style={{ flex: 1, minWidth: "300px", backgroundColor: "#111", padding: "1.5rem", borderRadius: "16px", border: "1px solid #ffaa0033" }}>
          <h2 style={{ color: "#ffaa00", marginBottom: "1rem" }}>📏 BMI Calculator</h2>

          <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Height (cm)</label>
          <input type="number" placeholder="e.g. 175" value={height}
            onChange={e => setHeight(e.target.value)} style={inputStyle} />

          <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Weight (kg)</label>
          <input type="number" placeholder="e.g. 70" value={weight}
            onChange={e => setWeight(e.target.value)} style={inputStyle} />

          <button onClick={calcBMI} style={{ ...buttonStyle, backgroundColor: "#ffaa00", color: "#0a0a0a" }}>
            Calculate BMI
          </button>

          {bmiResult && (
            <div style={{ marginTop: "1.5rem", textAlign: "center", padding: "1rem", backgroundColor: `${bmiResult.color}11`, borderRadius: "12px", border: `1px solid ${bmiResult.color}33` }}>
              <div style={{ fontSize: "3rem", fontWeight: "bold", color: bmiResult.color }}>{bmiResult.bmi}</div>
              <div style={{ color: bmiResult.color, fontWeight: "bold", fontSize: "1.1rem" }}>{bmiResult.category}</div>
              <div style={{ color: "#555", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                {bmiResult.bmi < 18.5 && "Consider increasing caloric intake"}
                {bmiResult.bmi >= 18.5 && bmiResult.bmi < 25 && "Great job! Maintain your healthy weight"}
                {bmiResult.bmi >= 25 && bmiResult.bmi < 30 && "Consider increasing physical activity"}
                {bmiResult.bmi >= 30 && "Consult a healthcare professional"}
              </div>
            </div>
          )}

          {/* BMI Scale */}
          <div style={{ marginTop: "1rem" }}>
            {[
              { range: "< 18.5", label: "Underweight", color: "#00aaff" },
              { range: "18.5 - 24.9", label: "Normal", color: "#00ff88" },
              { range: "25 - 29.9", label: "Overweight", color: "#ffaa00" },
              { range: "> 30", label: "Obese", color: "#ff4444" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid #222" }}>
                <span style={{ color: item.color, fontSize: "0.85rem" }}>{item.label}</span>
                <span style={{ color: "#555", fontSize: "0.85rem" }}>{item.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Protein Calculator */}
        <div style={{ flex: 1, minWidth: "300px", backgroundColor: "#111", padding: "1.5rem", borderRadius: "16px", border: "1px solid #00ff8833" }}>
          <h2 style={{ color: "#00ff88", marginBottom: "1rem" }}>🥩 Protein Calculator</h2>

          <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Weight (kg)</label>
          <input type="number" placeholder="e.g. 70" value={weight}
            onChange={e => setWeight(e.target.value)} style={inputStyle} />

          <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Age</label>
          <input type="number" placeholder="e.g. 25" value={age}
            onChange={e => setAge(e.target.value)} style={inputStyle} />

          <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Activity Level</label>
          <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} style={inputStyle}>
            <option value="sedentary">Sedentary (little/no exercise)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="very_active">Very Active (2x/day)</option>
          </select>

          <label style={{ color: "#888", fontSize: "0.85rem", display: "block", marginBottom: "0.4rem" }}>Fitness Goal</label>
          <select value={goal} onChange={e => setGoal(e.target.value)} style={inputStyle}>
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Gain Weight</option>
            <option value="muscle">Build Muscle</option>
          </select>

          <button onClick={calcProtein} style={{ ...buttonStyle, backgroundColor: "#00ff88", color: "#0a0a0a" }}>
            Calculate Protein
          </button>

          {proteinResult && (
            <div style={{ marginTop: "1.5rem", textAlign: "center", padding: "1rem", backgroundColor: "#00ff8811", borderRadius: "12px", border: "1px solid #00ff8833" }}>
              <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#00ff88" }}>{proteinResult.protein}g</div>
              <div style={{ color: "#00ff88", fontWeight: "bold" }}>Daily Protein Target</div>
              <div style={{ color: "#555", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                Based on your weight, activity level, and goal to {proteinResult.goal} weight
              </div>
            </div>
          )}
        </div>
      </div>
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

export default BMI;