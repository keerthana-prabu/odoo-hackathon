import { TEAL_LIGHT, TEAL_DARK, AMBER_LIGHT, GRAY_LIGHT } from "./constants";

export default function Badge({ children, color = "teal" }) {
  const colors = {
    teal:  { bg: TEAL_LIGHT,   text: TEAL_DARK },
    amber: { bg: AMBER_LIGHT,  text: "#633806" },
    gray:  { bg: GRAY_LIGHT,   text: "#444441" },
    green: { bg: "#EAF3DE",    text: "#27500A" },
    red:   { bg: "#FCEBEB",    text: "#791F1F" },
  };
  const c = colors[color] || colors.teal;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}