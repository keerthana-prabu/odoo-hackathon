import { TEAL_DARK, AMBER } from "./constants";

const links = [
  { key: "dashboard",         icon: "🏠", label: "Dashboard" },
  { key: "trips",             icon: "🗺️", label: "My Trips" },
  { key: "create-trip",       icon: "➕", label: "Create Trip" },
  { key: "itinerary-builder", icon: "🔧", label: "Itinerary Builder" },
  { key: "itinerary-view",    icon: "📋", label: "Itinerary View" },
  { key: "city-search",       icon: "🌍", label: "City Search" },
  { key: "activity-search",   icon: "🎯", label: "Activity Search" },
  { key: "budget",            icon: "💰", label: "Budget" },
  { key: "packing",           icon: "🎒", label: "Packing List" },
  { key: "shared",            icon: "🔗", label: "Shared View" },
  { key: "profile",           icon: "👤", label: "Profile" },
  { key: "notes",             icon: "📝", label: "Trip Notes" },
  { key: "admin",             icon: "📊", label: "Admin" },
];

export default function SideNav({ page, setPage }) {
  return (
    <div style={{ width: 220, background: TEAL_DARK, minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>✈️</span>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Traveloop</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>Plan. Explore. Go.</div>
      </div>
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {links.map(l => (
          <button key={l.key} onClick={() => setPage(l.key)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 20px",
            background: page === l.key ? "rgba(255,255,255,0.15)" : "transparent",
            border: "none",
            color: page === l.key ? "#fff" : "rgba(255,255,255,0.65)",
            fontSize: 13, fontWeight: page === l.key ? 600 : 400, cursor: "pointer",
            borderLeft: page === l.key ? `3px solid ${AMBER}` : "3px solid transparent",
            transition: "all 0.15s", textAlign: "left",
          }}>
            <span style={{ fontSize: 16 }}>{l.icon}</span> {l.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: AMBER, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>❤️</div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>Best Trips!</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Travel with us</div>
          </div>
        </div>
      </div>
    </div>
  );
}