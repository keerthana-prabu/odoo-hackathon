import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── colours (copy these into every page) ──────────────────────
const TEAL      = "#1D9E75";
const TEAL_LIGHT= "#E1F5EE";
const TEAL_DARK = "#085041";
const AMBER     = "#EF9F27";
const GRAY_LIGHT= "#F1EFE8";
const GRAY_MED  = "#888780";

// ── tiny shared components ─────────────────────────────────────
function Btn({ children, onClick, variant = "primary", style = {} }) {
  const base = {
    border: "none", borderRadius: 8, cursor: "pointer",
    fontWeight: 500, padding: "10px 20px", fontSize: 14,
    transition: "opacity 0.15s",
  };
  const variants = {
    primary:   { background: TEAL,       color: "#fff" },
    secondary: { background: TEAL_LIGHT, color: TEAL_DARK },
    ghost:     { background: "transparent", color: GRAY_MED, border: "1px solid #ddd" },
    danger:    { background: "#FCEBEB",  color: "#791F1F" },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick}>
      {children}
    </button>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, required }) {
  const [touched, setTouched] = useState(false);
  const showError = required && touched && !value;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        style={{
          border: `1px solid ${showError ? "red" : "#ddd"}`,
          borderRadius: 8, padding: "10px 14px",
          fontSize: 14, outline: "none", color: "#222", background: "#fff",
        }}
      />
      {showError && (
        <span style={{ fontSize: 12, color: "red" }}>This field is required</span>
      )}
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────
export default function CreateTripPage({ onTripCreated }) {
  // form state
  const [name,        setName]        = useState("");
  const [startDate,   setStartDate]   = useState("");
  const [endDate,     setEndDate]     = useState("");
  const [description, setDescription] = useState("");
  const [coverImage,  setCoverImage]  = useState(null);   // File object
  const [preview,     setPreview]     = useState(null);   // preview URL
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);

  // ── validation ───────────────────────────────────────────────
  function validate() {
    if (!name.trim())      return "Trip name is required.";
    if (!startDate)        return "Start date is required.";
    if (!endDate)          return "End date is required.";
    if (endDate < startDate) return "End date must be after start date.";
    return null;
  }

  // ── image preview handler ────────────────────────────────────
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));   // show preview instantly
    setError("");
  }

  // ── submit handler ───────────────────────────────────────────
  // TODO (backend): replace the fake save below with a real API call
  // Example of what backend call will look like:
  //
  //   const formData = new FormData();
  //   formData.append("name",        name);
  //   formData.append("startDate",   startDate);
  //   formData.append("endDate",     endDate);
  //   formData.append("description", description);
  //   if (coverImage) formData.append("cover", coverImage);
  //
  //   const res = await axios.post("/api/trips", formData, {
  //     headers: { "Content-Type": "multipart/form-data",
  //                Authorization: `Bearer ${localStorage.getItem("token")}` }
  //   });
  //   onTripCreated(res.data.trip);   // go to itinerary builder

  async function handleSubmit() {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError("");

    try {
      // ── FAKE SAVE (remove when backend is ready) ─────────────
      await new Promise(r => setTimeout(r, 800));   // simulate network
      const newTrip = {
        id:          Date.now(),
        name,
        startDate,
        endDate,
        description,
        cover:       preview || null,
      };
      console.log("Trip to save:", newTrip);
      setSuccess(true);
      // ── END FAKE SAVE ────────────────────────────────────────

      // when backend is ready, uncomment: onTripCreated(newTrip);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── success screen ───────────────────────────────────────────
  if (success) {
    return (
      <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: TEAL_DARK, fontSize: 22, fontWeight: 700 }}>Trip Created!</h2>
        <p style={{ color: GRAY_MED, marginBottom: 24 }}>
          <strong>{name}</strong> has been saved. Now let's build your itinerary!
        </p>
        <Btn onClick={() => setSuccess(false)}>Create Another Trip</Btn>
      </div>
    );
  }

  // ── main form ────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 600 }}>
      {/* header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
          Create New Trip
        </h1>
        <p style={{ color: GRAY_MED, fontSize: 14, margin: "4px 0 0" }}>
          Start planning your next adventure
        </p>
      </div>

      {/* form card */}
      <div style={{
        background: "#fff", borderRadius: 12,
        border: "1px solid #eee", padding: "1.5rem",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* cover photo upload */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444", display: "block", marginBottom: 6 }}>
              Cover Photo <span style={{ color: GRAY_MED }}>(optional)</span>
            </label>

            {/* image preview or upload box */}
            {preview ? (
              <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 160 }}>
                <img
                  src={preview}
                  alt="Cover preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={() => { setCoverImage(null); setPreview(null); }}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    background: "rgba(0,0,0,0.55)", color: "#fff",
                    border: "none", borderRadius: "50%",
                    width: 28, height: 28, cursor: "pointer", fontSize: 14,
                  }}
                >✕</button>
              </div>
            ) : (
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 8, height: 140,
                background: TEAL_LIGHT, borderRadius: 12,
                border: `2px dashed ${TEAL}`, cursor: "pointer",
              }}>
                <span style={{ fontSize: 32 }}>📸</span>
                <span style={{ fontSize: 13, color: TEAL_DARK, fontWeight: 500 }}>
                  Click to upload cover photo
                </span>
                <span style={{ fontSize: 11, color: GRAY_MED }}>JPG, PNG up to 5 MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>

          {/* trip name */}
          <Input
            label="Trip Name"
            placeholder="e.g. Europe Summer 2025"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          {/* dates */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>

          {/* description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>
              Trip Description
            </label>
            <textarea
              placeholder="Describe your trip goals, must-sees, or travel style..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                border: "1px solid #ddd", borderRadius: 8,
                padding: "10px 14px", fontSize: 14,
                minHeight: 100, resize: "vertical",
                outline: "none", fontFamily: "inherit",
              }}
            />
          </div>

          {/* error message */}
          {error && (
            <div style={{
              background: "#FCEBEB", color: "#791F1F",
              borderRadius: 8, padding: "10px 14px", fontSize: 13,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <Btn
              onClick={handleSubmit}
              style={{ flex: 1, padding: "12px", fontSize: 15, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Saving..." : "Save & Build Itinerary"}
            </Btn>
            <Btn variant="ghost" onClick={() => {
              setName(""); setStartDate(""); setEndDate("");
              setDescription(""); setCoverImage(null); setPreview(null); setError("");
            }}>
              Clear
            </Btn>
          </div>

        </div>
      </div>
    </div>
  );
}