import { useState } from "react";
import { TEAL, TEAL_DARK, GRAY_LIGHT, GRAY_MED } from "../Components/constants";
import Input from "../Components/Input";

export default function LoginPage({ setPage }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
  setLoading(true);
  setError("");
  try {
    const res = await fetch(`/api/auth/${tab}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setPage("dashboard");
  } catch (err) {
    setError(err.message || "Something went wrong");
  }
  setLoading(false);
};

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${TEAL_DARK} 0%, ${TEAL} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 420, background: "#fff", borderRadius: 20, padding: "2.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✈️</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: TEAL_DARK, margin: 0 }}>Traveloop</h1>
          <p style={{ color: GRAY_MED, fontSize: 13, margin: "4px 0 0" }}>Your personalized travel planner</p>
        </div>

        <div style={{ display: "flex", background: GRAY_LIGHT, borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500,
              background: tab === t ? "#fff" : "transparent", color: tab === t ? TEAL_DARK : GRAY_MED,
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}>{t === "login" ? "Log In" : "Sign Up"}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tab === "signup" && (
            <Input label="Full Name" placeholder="Your name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          )}
          <Input label="Email" type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

          {tab === "login" && (
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 13, color: TEAL, cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
            </div>
          )}

          {error && <div style={{ fontSize: 13, color: "red", textAlign: "center" }}>{error}</div>}

          <button onClick={handleSubmit} disabled={loading} style={{
            background: TEAL, color: "#fff", border: "none", borderRadius: 8,
            padding: "12px", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Please wait..." : tab === "login" ? "Log In" : "Create Account"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: GRAY_MED }}>
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: TEAL, cursor: "pointer", fontWeight: 500 }} onClick={() => setTab(tab === "login" ? "signup" : "login")}>
            {tab === "login" ? "Sign Up" : "Log In"}
          </span>
        </div>

        <div style={{ margin: "20px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#eee" }} />
          <span style={{ fontSize: 12, color: GRAY_MED }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "#eee" }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {["🌐 Google", "🍎 Apple"].map(p => (
            <button key={p} onClick={() => setPage("dashboard")} style={{
              flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: 8,
              background: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500,
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}