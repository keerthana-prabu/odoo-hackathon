import { useState } from "react";

const TEAL = "#1D9E75";
const TEAL_LIGHT = "#E1F5EE";
const TEAL_DARK = "#085041";
const GRAY_MED = "#888780";

export default function CreateTripPage({ setPage }) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  const tripDays =
    startDate && endDate && endDate >= startDate
      ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      : null;

  function validate() {
    if (!name.trim()) return "Trip name is required.";
    if (!startDate) return "Start date is required.";
    if (!endDate) return "End date is required.";
    if (endDate < startDate) return "End date must be after start date.";
    return null;
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5 MB."); return; }
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  async function handleSubmit() {
    setTouched({ name: true, startDate: true, endDate: true });
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name,
          start_date: startDate,
          end_date: endDate,
          description,
          cover: "🌍",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create trip");
      localStorage.setItem("currentTripId", JSON.stringify(data.id));
      setPage("itinerary-builder");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Create New Trip</h1>
        <p style={{ color: GRAY_MED, fontSize: 14, margin: "4px 0 0" }}>Start planning your next adventure</p>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Cover Photo */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444", display: "block", marginBottom: 6 }}>
              Cover Photo <span style={{ color: GRAY_MED }}>(optional)</span>
            </label>
            {preview ? (
              <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 160 }}>
                <img src={preview} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => { setCoverImage(null); setPreview(null); }}
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, height: 140, background: TEAL_LIGHT, borderRadius: 12, border: `2px dashed ${TEAL}`, cursor: "pointer" }}>
                <span style={{ fontSize: 32 }}>📸</span>
                <span style={{ fontSize: 13, color: TEAL_DARK, fontWeight: 500 }}>Click to upload cover photo</span>
                <span style={{ fontSize: 11, color: GRAY_MED }}>JPG, PNG up to 5 MB</span>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>
            )}
          </div>

          {/* Trip Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Trip Name <span style={{ color: "red" }}>*</span></label>
            <input type="text" placeholder="e.g. Europe Summer 2025" value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              style={{ border: `1px solid ${touched.name && !name.trim() ? "red" : "#ddd"}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none" }} />
            {touched.name && !name.trim() && <span style={{ fontSize: 12, color: "red" }}>Trip name is required</span>}
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Start Date <span style={{ color: "red" }}>*</span></label>
              <input type="date" value={startDate}
                onChange={e => { setStartDate(e.target.value); setError(""); }}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>End Date <span style={{ color: "red" }}>*</span></label>
              <input type="date" value={endDate}
                onChange={e => { setEndDate(e.target.value); setError(""); }}
                style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none" }} />
            </div>
          </div>

          {/* Duration */}
          {tripDays && (
            <div style={{ background: TEAL_LIGHT, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: TEAL_DARK, fontWeight: 500 }}>
              📅 Your trip is {tripDays} day{tripDays > 1 ? "s" : ""} long
            </div>
          )}

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Trip Description</label>
            <textarea placeholder="Describe your trip goals, must-sees, or travel style..." value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, minHeight: 100, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
            <span style={{ fontSize: 12, color: GRAY_MED, textAlign: "right" }}>{description.length} characters</span>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#FCEBEB", color: "#791F1F", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={handleSubmit} disabled={loading}
              style={{ flex: 1, background: TEAL, color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : "Save & Build Itinerary →"}
            </button>
            <button onClick={() => setPage("trips")}
              style={{ background: "transparent", color: GRAY_MED, border: "1px solid #ddd", borderRadius: 8, padding: "12px 20px", fontSize: 14, cursor: "pointer" }}>
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}