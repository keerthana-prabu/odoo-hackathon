export default function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: "1.25rem", cursor: onClick ? "pointer" : "default", ...style }}
    >
      {children}
    </div>
  );
}