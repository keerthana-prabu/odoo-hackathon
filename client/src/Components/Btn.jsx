import { TEAL, TEAL_LIGHT, TEAL_DARK, AMBER, GRAY_MED } from "./constants";

export default function Btn({ children, onClick, variant = "primary", small, style = {} }) {
  const base = {
    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500,
    padding: small ? "6px 14px" : "10px 20px", fontSize: small ? 13 : 14,
    transition: "opacity 0.15s", ...style,
  };
  const styles = {
    primary:   { background: TEAL,       color: "#fff" },
    secondary: { background: TEAL_LIGHT, color: TEAL_DARK },
    ghost:     { background: "transparent", color: GRAY_MED, border: "1px solid #ddd" },
    danger:    { background: "#FCEBEB",  color: "#791F1F" },
    amber:     { background: AMBER,      color: "#fff" },
  };
  return (
    <button style={{ ...base, ...styles[variant] }} onClick={onClick}>
      {children}
    </button>
  );
}