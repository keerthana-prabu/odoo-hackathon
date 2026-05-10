export default function Input({ label, type = "text", placeholder, value, onChange, error, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          border: `1px solid ${error ? "red" : "#ddd"}`, borderRadius: 8,
          padding: "10px 14px", fontSize: 14, outline: "none", color: "#222",
          background: "#fff", ...style,
        }}
      />
      {error && <span style={{ fontSize: 12, color: "red" }}>{error}</span>}
    </div>
  );
}