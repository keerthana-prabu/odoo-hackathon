import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, AMBER, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import Input from "../Components/Input";
import PageHeader from "../Components/PageHeader";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", email: "", bio: "", lang: "English" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedDests, setSavedDests] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
       const res = await fetch("/api/profile", {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
const data = await res.json();
setForm({ name: data.name, email: data.email, bio: data.bio || "", lang: data.lang || "English" });
setSavedDests(data.savedDestinations || []);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
     await fetch("/api/profile", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  body: JSON.stringify(form),
});
setSaved(true);
setTimeout(() => setSaved(false), 2000);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  const removeDest = async (name) => {
    setSavedDests(savedDests.filter(d => d.name !== name));
    // TODO: DELETE /api/profile/saved/:name
  };

  const initials = form.name ? form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="Profile & Settings" subtitle="Manage your account and preferences" />

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff" }}>
              {initials}
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, background: AMBER, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer" }}>✎</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{form.name || "Your Name"}</div>
            <div style={{ color: GRAY_MED, fontSize: 13 }}>{form.email}</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 20, color: GRAY_MED }}>Loading profile...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about your travel style..."
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, minHeight: 80, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Language</label>
              <select value={form.lang} onChange={e => setForm({ ...form, lang: e.target.value })}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", background: "#fff" }}>
                {["English", "Hindi", "Tamil", "Spanish", "French", "Japanese"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn style={{ flex: 1 }} onClick={handleSave}>{saved ? "✓ Saved!" : "Save Changes"}</Btn>
              <Btn variant="ghost">Change Password</Btn>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Saved Destinations</div>
        {savedDests.length === 0 ? (
          <p style={{ color: GRAY_MED, fontSize: 13 }}>No saved destinations yet</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {savedDests.map(d => (
              <div key={d.name} style={{ display: "flex", gap: 6, alignItems: "center", background: TEAL_LIGHT, borderRadius: 20, padding: "6px 14px", fontSize: 13, color: TEAL_DARK, fontWeight: 500 }}>
                {d.emoji} {d.name}
                <span style={{ cursor: "pointer", opacity: 0.6 }} onClick={() => removeDest(d.name)}>×</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <Btn variant="danger" small>Delete Account</Btn>
        </div>
      </Card>
    </div>
  );
}