import { useState } from "react";

const TEAL = "#1D9E75";
const TEAL_LIGHT = "#E1F5EE";
const TEAL_DARK = "#085041";
const AMBER = "#EF9F27";
const AMBER_LIGHT = "#FAEEDA";
const GRAY_LIGHT = "#F1EFE8";
const GRAY_MED = "#888780";

const sampleTrips = [
  { id: 1, name: "Europe Adventure", dates: "Jun 12 – Jul 2, 2025", cities: 5, budget: 3200, status: "Upcoming", cover: "🏰" },
  { id: 2, name: "Japan Discovery", dates: "Sep 1 – Sep 20, 2025", cities: 4, budget: 2800, status: "Planning", cover: "⛩️" },
  { id: 3, name: "Bali Retreat", dates: "Dec 10 – Dec 20, 2024", cities: 2, budget: 1500, status: "Completed", cover: "🌴" },
];

const sampleCities = [
  { id: 1, name: "Paris", country: "France", costIndex: "High", popularity: 98, emoji: "🗼", activities: ["Eiffel Tower", "Louvre Museum", "Seine Cruise"] },
  { id: 2, name: "Tokyo", country: "Japan", costIndex: "High", popularity: 95, emoji: "⛩️", activities: ["Senso-ji", "Shibuya Crossing", "TeamLab"] },
  { id: 3, name: "Barcelona", country: "Spain", costIndex: "Medium", popularity: 90, emoji: "🏖️", activities: ["Sagrada Família", "Park Güell", "Las Ramblas"] },
  { id: 4, name: "Bali", country: "Indonesia", costIndex: "Low", popularity: 88, emoji: "🌴", activities: ["Tanah Lot", "Ubud", "Kuta Beach"] },
  { id: 5, name: "New York", country: "USA", costIndex: "High", popularity: 97, emoji: "🗽", activities: ["Central Park", "Times Square", "MoMA"] },
  { id: 6, name: "Rome", country: "Italy", costIndex: "Medium", popularity: 93, emoji: "🏛️", activities: ["Colosseum", "Vatican", "Trevi Fountain"] },
];

const sampleActivities = [
  { id: 1, name: "Eiffel Tower Visit", type: "Sightseeing", cost: 28, duration: "3h", city: "Paris", emoji: "🗼" },
  { id: 2, name: "Seine River Cruise", type: "Experience", cost: 20, duration: "1h", city: "Paris", emoji: "🚢" },
  { id: 3, name: "Louvre Museum", type: "Culture", cost: 17, duration: "4h", city: "Paris", emoji: "🎨" },
  { id: 4, name: "Food Tour Montmartre", type: "Food", cost: 65, duration: "3h", city: "Paris", emoji: "🥐" },
  { id: 5, name: "Versailles Day Trip", type: "Sightseeing", cost: 45, duration: "Full day", city: "Paris", emoji: "🏰" },
  { id: 6, name: "Cooking Class", type: "Experience", cost: 80, duration: "3h", city: "Paris", emoji: "👨‍🍳" },
];

const packingCategories = {
  Clothing: ["T-shirts (5)", "Pants (3)", "Underwear (7)", "Socks (7)", "Jacket", "Swimwear"],
  Documents: ["Passport", "Travel insurance", "Hotel bookings", "Flight tickets", "Visa documents"],
  Electronics: ["Phone charger", "Power bank", "Camera", "Adaptor plug", "Headphones"],
  Toiletries: ["Sunscreen", "Toothbrush", "Shampoo", "Medicines", "First aid kit"],
};

const tripNotes = [
  { id: 1, title: "Hotel check-in details", content: "Check-in at Le Marais Hotel: 3pm. Contact: +33 1 42 78 47 22. Room 304.", date: "Jun 10", stop: "Paris" },
  { id: 2, title: "Local contacts", content: "Tour guide Marie: +33 6 12 34 56 78. Available Mon-Sat 9am-6pm.", date: "Jun 11", stop: "Paris" },
  { id: 3, title: "Day 3 reminders", content: "Museum closed on Tuesdays! Book Louvre tickets online 2 days ahead.", date: "Jun 13", stop: "Paris" },
];

function Badge({ children, color = "teal" }) {
  const colors = {
    teal: { bg: TEAL_LIGHT, text: TEAL_DARK },
    amber: { bg: AMBER_LIGHT, text: "#633806" },
    gray: { bg: GRAY_LIGHT, text: "#444441" },
    green: { bg: "#EAF3DE", text: "#27500A" },
    red: { bg: "#FCEBEB", text: "#791F1F" },
  };
  const c = colors[color] || colors.teal;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", small, style = {} }) {
  const base = {
    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500,
    padding: small ? "6px 14px" : "10px 20px", fontSize: small ? 13 : 14,
    transition: "opacity 0.15s", ...style,
  };
  const styles = {
    primary: { background: TEAL, color: "#fff" },
    secondary: { background: TEAL_LIGHT, color: TEAL_DARK },
    ghost: { background: "transparent", color: GRAY_MED, border: `1px solid #ddd` },
    danger: { background: "#FCEBEB", color: "#791F1F" },
    amber: { background: AMBER, color: "#fff" },
  };
  return <button style={{ ...base, ...styles[variant] }} onClick={onClick}>{children}</button>;
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: "1.25rem", ...style }}>
      {children}
    </div>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px",
          fontSize: 14, outline: "none", color: "#222", background: "#fff", ...style,
        }}
      />
    </div>
  );
}

function SideNav({ page, setPage }) {
  const links = [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "trips", icon: "🗺️", label: "My Trips" },
    { key: "create-trip", icon: "➕", label: "Create Trip" },
    { key: "itinerary-builder", icon: "🔧", label: "Itinerary Builder" },
    { key: "itinerary-view", icon: "📋", label: "Itinerary View" },
    { key: "city-search", icon: "🌍", label: "City Search" },
    { key: "activity-search", icon: "🎯", label: "Activity Search" },
    { key: "budget", icon: "💰", label: "Budget" },
    { key: "packing", icon: "🎒", label: "Packing List" },
    { key: "shared", icon: "🔗", label: "Shared View" },
    { key: "profile", icon: "👤", label: "Profile" },
    { key: "notes", icon: "📝", label: "Trip Notes" },
    { key: "admin", icon: "📊", label: "Admin" },
  ];
  return (
    <div style={{ width: 220, background: TEAL_DARK, minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>✈️</span>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px" }}>Traveloop</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>Plan. Explore. Go.</div>
      </div>
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {links.map(l => (
          <button key={l.key} onClick={() => setPage(l.key)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 20px", background: page === l.key ? "rgba(255,255,255,0.15)" : "transparent",
            border: "none", color: page === l.key ? "#fff" : "rgba(255,255,255,0.65)",
            fontSize: 13, fontWeight: page === l.key ? 600 : 400, cursor: "pointer",
            borderLeft: page === l.key ? "3px solid " + AMBER : "3px solid transparent",
            transition: "all 0.15s", textAlign: "left",
          }}>
            <span style={{ fontSize: 16 }}>{l.icon}</span> {l.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: AMBER, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>AK</div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>Arjun Kumar</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>arjun@email.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ color: GRAY_MED, fontSize: 14, margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
    </div>
  );
}

// Page 1: Login
function LoginPage({ setPage }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
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
          {tab === "signup" && <Input label="Full Name" placeholder="Arjun Kumar" />}
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
          {tab === "login" && (
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 13, color: TEAL, cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
            </div>
          )}
          <Btn onClick={() => setPage("dashboard")} style={{ width: "100%", padding: "12px", fontSize: 15 }}>
            {tab === "login" ? "Log In" : "Create Account"}
          </Btn>
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
            <button key={p} onClick={() => setPage("dashboard")} style={{ flex: 1, padding: "10px", border: "1px solid #ddd", borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Page 2: Dashboard
function DashboardPage({ setPage }) {
  const stats = [
    { label: "Total Trips", value: "8", icon: "🗺️" },
    { label: "Cities Visited", value: "23", icon: "🌍" },
    { label: "Countries", value: "11", icon: "🏳️" },
    { label: "Budget Saved", value: "₹12K", icon: "💰" },
  ];
  const recommended = [
    { name: "Santorini", emoji: "🏝️", country: "Greece", vibe: "Romantic" },
    { name: "Kyoto", emoji: "⛩️", country: "Japan", vibe: "Cultural" },
    { name: "Machu Picchu", emoji: "🏔️", country: "Peru", vibe: "Adventure" },
    { name: "Cape Town", emoji: "🌊", country: "S. Africa", vibe: "Scenic" },
  ];
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`, borderRadius: 16, padding: "28px 28px 24px", marginBottom: 28, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Good morning 👋</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Welcome back, Arjun!</h2>
        <p style={{ fontSize: 14, opacity: 0.8, margin: "0 0 20px" }}>Ready to plan your next adventure?</p>
        <Btn onClick={() => setPage("create-trip")} variant="amber" style={{ fontSize: 14 }}>+ Plan New Trip</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "1rem" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: TEAL_DARK }}>{s.value}</div>
            <div style={{ fontSize: 12, color: GRAY_MED }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Recent Trips</h3>
            <span style={{ fontSize: 13, color: TEAL, cursor: "pointer", fontWeight: 500 }} onClick={() => setPage("trips")}>View all →</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sampleTrips.map(t => (
              <Card key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", cursor: "pointer" }} onClick={() => setPage("itinerary-view")}>
                <div style={{ fontSize: 28, width: 48, height: 48, background: TEAL_LIGHT, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t.cover}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: GRAY_MED, marginTop: 2 }}>{t.dates} · {t.cities} cities</div>
                </div>
                <Badge color={t.status === "Completed" ? "gray" : t.status === "Upcoming" ? "teal" : "amber"}>{t.status}</Badge>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 600 }}>Recommended Destinations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recommended.map(r => (
              <Card key={r.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer" }}>
                <div style={{ fontSize: 24 }}>{r.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: GRAY_MED }}>{r.country}</div>
                </div>
                <Badge color="teal">{r.vibe}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Page 3: Create Trip
function CreateTripPage({ setPage }) {
  const [form, setForm] = useState({ name: "", start: "", end: "", desc: "" });
  return (
    <div style={{ maxWidth: 600 }}>
      <PageHeader title="Create New Trip" subtitle="Start planning your next adventure" />
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: TEAL_LIGHT, borderRadius: 12, height: 140, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, border: "2px dashed " + TEAL, cursor: "pointer" }}>
            <span style={{ fontSize: 32 }}>📸</span>
            <span style={{ fontSize: 13, color: TEAL_DARK, fontWeight: 500 }}>Upload Cover Photo (optional)</span>
            <span style={{ fontSize: 11, color: GRAY_MED }}>JPG, PNG up to 5MB</span>
          </div>
          <Input label="Trip Name" placeholder="e.g. Europe Summer 2025" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Start Date" type="date" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
            <Input label="End Date" type="date" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Trip Description</label>
            <textarea placeholder="Describe your trip goals, must-sees, or travel style..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, minHeight: 100, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn onClick={() => setPage("itinerary-builder")} style={{ flex: 1 }}>Save & Build Itinerary</Btn>
            <Btn variant="ghost" onClick={() => setPage("trips")}>Cancel</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Page 4: My Trips
function TripsPage({ setPage }) {
  const [filter, setFilter] = useState("All");
  const tabs = ["All", "Upcoming", "Planning", "Completed"];
  const filtered = filter === "All" ? sampleTrips : sampleTrips.filter(t => t.status === filter);
  return (
    <div>
      <PageHeader title="My Trips" subtitle="All your travel plans in one place" actions={<Btn onClick={() => setPage("create-trip")}>+ New Trip</Btn>} />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "7px 16px", borderRadius: 20, border: "1px solid #ddd", fontSize: 13, cursor: "pointer", fontWeight: 500,
            background: filter === t ? TEAL : "#fff", color: filter === t ? "#fff" : "#555",
          }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {filtered.map(t => (
          <Card key={t.id} style={{ padding: 0, overflow: "hidden", cursor: "pointer" }} onClick={() => setPage("itinerary-view")}>
            <div style={{ height: 110, background: `linear-gradient(135deg, ${TEAL_LIGHT}, ${TEAL_LIGHT}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>{t.cover}</div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                <Badge color={t.status === "Completed" ? "gray" : t.status === "Upcoming" ? "teal" : "amber"}>{t.status}</Badge>
              </div>
              <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 10 }}>{t.dates}</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: GRAY_MED }}>
                <span>🌍 {t.cities} cities</span>
                <span>💰 ${t.budget.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                <Btn small variant="secondary" onClick={e => { e.stopPropagation(); setPage("itinerary-view"); }}>View</Btn>
                <Btn small variant="ghost" onClick={e => { e.stopPropagation(); setPage("itinerary-builder"); }}>Edit</Btn>
                <Btn small variant="danger" onClick={e => e.stopPropagation()}>Delete</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Page 5: Itinerary Builder
function ItineraryBuilderPage({ setPage }) {
  const [stops, setStops] = useState([
    { city: "Paris", emoji: "🗼", from: "Jun 12", to: "Jun 17", activities: ["Eiffel Tower", "Louvre"] },
    { city: "Barcelona", emoji: "🏖️", from: "Jun 17", to: "Jun 21", activities: ["Sagrada Família"] },
  ]);
  const addStop = () => setStops([...stops, { city: "New City", emoji: "🌍", from: "", to: "", activities: [] }]);
  return (
    <div>
      <PageHeader title="Itinerary Builder" subtitle="Europe Adventure · Jun 12 – Jul 2, 2025" actions={<><Btn variant="secondary" onClick={() => setPage("city-search")}>+ Add Stop</Btn><Btn onClick={() => setPage("itinerary-view")}>Preview</Btn></>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {stops.map((stop, i) => (
          <Card key={i}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 48, height: 48, background: TEAL_LIGHT, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{stop.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Stop {i + 1}: {stop.city}</div>
                    <div style={{ fontSize: 12, color: GRAY_MED }}>{stop.from} → {stop.to}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small variant="secondary" onClick={() => setPage("activity-search")}>+ Activity</Btn>
                    <Btn small variant="ghost">⬆</Btn>
                    <Btn small variant="ghost">⬇</Btn>
                    <Btn small variant="danger">✕</Btn>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  <Input label="From" type="date" value={stop.from} onChange={() => {}} />
                  <Input label="To" type="date" value={stop.to} onChange={() => {}} />
                </div>
                {stop.activities.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8 }}>Activities:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {stop.activities.map(a => (
                        <span key={a} style={{ background: TEAL_LIGHT, color: TEAL_DARK, fontSize: 12, padding: "4px 10px", borderRadius: 6, fontWeight: 500 }}>✓ {a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        <button onClick={addStop} style={{ border: "2px dashed #ddd", borderRadius: 12, padding: "16px", background: "transparent", cursor: "pointer", color: GRAY_MED, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          + Add Another Stop
        </button>
      </div>
    </div>
  );
}

// Page 6: Itinerary View
function ItineraryViewPage({ setPage }) {
  const [viewMode, setViewMode] = useState("list");
  const days = [
    { date: "Jun 12, Thu", city: "Paris", activities: [{ name: "Arrive CDG · Check-in hotel", time: "2:00 PM", cost: 0, type: "Travel" }, { name: "Seine River Cruise", time: "7:00 PM", cost: 20, type: "Experience" }] },
    { date: "Jun 13, Fri", city: "Paris", activities: [{ name: "Louvre Museum", time: "10:00 AM", cost: 17, type: "Culture" }, { name: "Eiffel Tower", time: "3:00 PM", cost: 28, type: "Sightseeing" }, { name: "Food Tour Montmartre", time: "7:30 PM", cost: 65, type: "Food" }] },
    { date: "Jun 14, Sat", city: "Paris", activities: [{ name: "Versailles Day Trip", time: "9:00 AM", cost: 45, type: "Sightseeing" }] },
    { date: "Jun 17, Tue", city: "Barcelona", activities: [{ name: "Arrive BCN · Check-in", time: "12:00 PM", cost: 0, type: "Travel" }, { name: "Sagrada Família", time: "4:00 PM", cost: 26, type: "Culture" }] },
  ];
  const typeColors = { Travel: "gray", Experience: "teal", Culture: "amber", Sightseeing: "green", Food: "red" };
  return (
    <div>
      <PageHeader title="Europe Adventure" subtitle="Jun 12 – Jul 2, 2025 · 5 cities · $3,200 budget"
        actions={<>
          <div style={{ display: "flex", background: GRAY_LIGHT, borderRadius: 8, padding: 3 }}>
            {["list", "calendar"].map(m => (
              <button key={m} onClick={() => setViewMode(m)} style={{ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: viewMode === m ? "#fff" : "transparent", color: viewMode === m ? TEAL_DARK : GRAY_MED }}>
                {m === "list" ? "📋 List" : "📅 Calendar"}
              </button>
            ))}
          </div>
          <Btn variant="secondary" onClick={() => setPage("shared")}>🔗 Share</Btn>
          <Btn onClick={() => setPage("itinerary-builder")}>Edit</Btn>
        </>}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {days.map((d, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ background: TEAL, color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700 }}>{d.date}</div>
              <div style={{ fontWeight: 600, color: "#333", fontSize: 14 }}>📍 {d.city}</div>
              <div style={{ flex: 1, height: 1, background: "#eee" }} />
            </div>
            <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {d.activities.map((a, j) => (
                <Card key={j} style={{ display: "flex", gap: 14, padding: "12px 16px", alignItems: "center" }}>
                  <div style={{ color: GRAY_MED, fontSize: 12, fontWeight: 500, minWidth: 60 }}>{a.time}</div>
                  <div style={{ width: 2, height: 30, background: TEAL_LIGHT, borderRadius: 1 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{a.name}</div>
                  </div>
                  <Badge color={typeColors[a.type] || "gray"}>{a.type}</Badge>
                  {a.cost > 0 && <div style={{ fontSize: 13, fontWeight: 600, color: TEAL_DARK }}>${a.cost}</div>}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Page 7: City Search
function CitySearchPage({ setPage }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filtered = sampleCities.filter(c =>
    (c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase())) &&
    (filter === "All" || c.costIndex === filter)
  );
  return (
    <div>
      <PageHeader title="City Search" subtitle="Discover and add cities to your itinerary" />
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input placeholder="🔍  Search cities or countries..." value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1, border: "1px solid #ddd", borderRadius: 10, padding: "11px 16px", fontSize: 14, outline: "none" }} />
        {["All", "Low", "Medium", "High"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: filter === f ? TEAL : "#fff", color: filter === f ? "#fff" : "#555", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>{f} Cost</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(c => (
          <Card key={c.id} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ background: TEAL_LIGHT, height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{c.emoji}</div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                <Badge color={c.costIndex === "High" ? "red" : c.costIndex === "Low" ? "green" : "amber"}>{c.costIndex}</Badge>
              </div>
              <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 10 }}>🌍 {c.country} · ⭐ {c.popularity}% popularity</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                {c.activities.map(a => <span key={a} style={{ fontSize: 11, background: GRAY_LIGHT, color: "#555", padding: "3px 8px", borderRadius: 4 }}>{a}</span>)}
              </div>
              <Btn small style={{ width: "100%" }} onClick={() => setPage("itinerary-builder")}>+ Add to Trip</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Page 8: Activity Search
function ActivitySearchPage({ setPage }) {
  const [filter, setFilter] = useState("All");
  const [added, setAdded] = useState([]);
  const types = ["All", "Sightseeing", "Culture", "Food", "Experience"];
  const filtered = filter === "All" ? sampleActivities : sampleActivities.filter(a => a.type === filter);
  const toggle = id => setAdded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return (
    <div>
      <PageHeader title="Activity Search" subtitle="Browse and add activities to your stops" />
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding: "7px 16px", borderRadius: 20, border: "1px solid #ddd", background: filter === t ? TEAL : "#fff", color: filter === t ? "#fff" : "#555", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {filtered.map(a => (
          <Card key={a.id} style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ fontSize: 30, width: 52, height: 52, background: TEAL_LIGHT, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{a.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: GRAY_MED, margin: "3px 0 6px" }}>📍 {a.city} · ⏱ {a.duration}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge color="teal">{a.type}</Badge>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEAL_DARK }}>${a.cost}</span>
              </div>
            </div>
            <button onClick={() => toggle(a.id)} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid " + (added.includes(a.id) ? TEAL : "#ddd"), background: added.includes(a.id) ? TEAL : "#fff", color: added.includes(a.id) ? "#fff" : GRAY_MED, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {added.includes(a.id) ? "✓" : "+"}
            </button>
          </Card>
        ))}
      </div>
      {added.length > 0 && (
        <div style={{ position: "sticky", bottom: 16, background: TEAL_DARK, color: "#fff", borderRadius: 12, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          <span style={{ fontWeight: 500 }}>{added.length} activit{added.length > 1 ? "ies" : "y"} selected</span>
          <Btn variant="amber" small onClick={() => setPage("itinerary-builder")}>Add to Stop →</Btn>
        </div>
      )}
    </div>
  );
}

// Page 9: Budget
function BudgetPage() {
  const breakdown = [
    { label: "Flights", amount: 850, icon: "✈️", color: "#E6F1FB", text: "#185FA5" },
    { label: "Hotels", amount: 920, icon: "🏨", color: TEAL_LIGHT, text: TEAL_DARK },
    { label: "Activities", amount: 480, icon: "🎯", color: AMBER_LIGHT, text: "#633806" },
    { label: "Meals", amount: 650, icon: "🍽️", color: "#FAECE7", text: "#993C1D" },
    { label: "Transport", amount: 180, icon: "🚌", color: GRAY_LIGHT, text: "#444441" },
    { label: "Misc", amount: 120, icon: "🛍️", color: "#EAF3DE", text: "#27500A" },
  ];
  const total = breakdown.reduce((s, b) => s + b.amount, 0);
  const budget = 3200;
  const pct = Math.round((total / budget) * 100);
  return (
    <div>
      <PageHeader title="Budget & Cost Breakdown" subtitle="Europe Adventure · Jun 12 – Jul 2, 2025" />
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, marginBottom: 24 }}>
        <Card>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: GRAY_MED }}>Total Estimated</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: TEAL_DARK }}>${total.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: GRAY_MED }}>of ${budget.toLocaleString()} budget</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: pct > 90 ? "#E24B4A" : TEAL }}>{pct}% used</div>
              </div>
            </div>
            <div style={{ background: GRAY_LIGHT, borderRadius: 8, height: 10, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct > 90 ? "#E24B4A" : TEAL, borderRadius: 8, transition: "width 0.5s" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: TEAL_LIGHT, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, color: TEAL_DARK, fontWeight: 500 }}>Avg per day</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: TEAL_DARK }}>${Math.round(total / 20)}</div>
            </div>
            <div style={{ background: GRAY_LIGHT, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>Remaining</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#333" }}>${(budget - total).toLocaleString()}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Breakdown by Category</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {breakdown.map(b => (
              <div key={b.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: "#333" }}>{b.icon} {b.label}</span>
                  <span style={{ fontWeight: 600 }}>${b.amount}</span>
                </div>
                <div style={{ background: GRAY_LIGHT, borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.round((b.amount / total) * 100)}%`, background: b.text, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Cost by City</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[{ city: "Paris", emoji: "🗼", cost: 1420, days: 5 }, { city: "Barcelona", emoji: "🏖️", cost: 980, days: 4 }, { city: "Rome", emoji: "🏛️", cost: 800, days: 3 }].map(c => (
            <div key={c.city} style={{ background: TEAL_LIGHT, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{c.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: TEAL_DARK }}>{c.city}</div>
              <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 8 }}>{c.days} days</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: TEAL_DARK }}>${c.cost}</div>
              <div style={{ fontSize: 11, color: GRAY_MED }}>${Math.round(c.cost / c.days)}/day avg</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Page 10: Packing List
function PackingPage() {
  const [checked, setChecked] = useState({});
  const toggle = key => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const totalItems = Object.values(packingCategories).flat().length;
  const packedCount = Object.values(checked).filter(Boolean).length;
  return (
    <div>
      <PageHeader title="Packing Checklist" subtitle="Europe Adventure"
        actions={<><Btn variant="ghost" small>+ Add Item</Btn><Btn variant="danger" small onClick={() => setChecked({})}>Reset</Btn></>}
      />
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{packedCount} / {totalItems} packed</div>
            <div style={{ fontSize: 13, color: GRAY_MED }}>Keep going! You're almost ready.</div>
          </div>
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#eee" strokeWidth="8" />
              <circle cx="32" cy="32" r="28" fill="none" stroke={TEAL} strokeWidth="8"
                strokeDasharray={`${Math.round((packedCount / totalItems) * 175.9)} 175.9`}
                strokeLinecap="round" transform="rotate(-90 32 32)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{Math.round((packedCount / totalItems) * 100)}%</div>
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {Object.entries(packingCategories).map(([cat, items]) => (
          <Card key={cat}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", gap: 8, alignItems: "center" }}>
              <span>{cat === "Clothing" ? "👕" : cat === "Documents" ? "📄" : cat === "Electronics" ? "🔌" : "🧴"}</span>
              {cat}
              <Badge color="gray">{items.filter(i => checked[cat + i]).length}/{items.length}</Badge>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map(item => {
                const key = cat + item;
                return (
                  <div key={item} onClick={() => toggle(key)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked[key] ? TEAL : "#ddd"}`, background: checked[key] ? TEAL : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, flexShrink: 0 }}>
                      {checked[key] ? "✓" : ""}
                    </div>
                    <span style={{ fontSize: 14, color: checked[key] ? GRAY_MED : "#333", textDecoration: checked[key] ? "line-through" : "none" }}>{item}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Page 11: Shared/Public View
function SharedPage({ setPage }) {
  const [copied, setCopied] = useState(false);
  const copyLink = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div>
      <PageHeader title="Shared Itinerary" subtitle="Public view of Europe Adventure" />
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, background: GRAY_LIGHT, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: GRAY_MED, fontFamily: "monospace" }}>
            https://traveloop.app/shared/europe-2025-arjun
          </div>
          <Btn onClick={copyLink} variant="secondary">{copied ? "✓ Copied!" : "📋 Copy Link"}</Btn>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {["Twitter", "WhatsApp", "Email"].map(s => (
            <Btn key={s} small variant="ghost">Share on {s}</Btn>
          ))}
        </div>
      </Card>
      <div style={{ background: TEAL_LIGHT, border: `2px solid ${TEAL}`, borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontSize: 44 }}>🏰</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: TEAL_DARK }}>Europe Adventure</div>
            <div style={{ color: GRAY_MED, fontSize: 14 }}>by Arjun Kumar · Jun 12 – Jul 2, 2025</div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <span style={{ fontSize: 13 }}>🌍 5 cities</span>
              <span style={{ fontSize: 13 }}>💰 $3,200 budget</span>
              <span style={{ fontSize: 13 }}>📅 21 days</span>
            </div>
          </div>
          <Btn style={{ marginLeft: "auto" }} onClick={() => {}}>📋 Copy Trip</Btn>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, opacity: 0.9 }}>
        {[{ city: "Paris", emoji: "🗼", days: "Jun 12-17", activities: "Eiffel Tower, Louvre, Seine Cruise" }, { city: "Barcelona", emoji: "🏖️", days: "Jun 17-21", activities: "Sagrada Família, Park Güell, Las Ramblas" }, { city: "Rome", emoji: "🏛️", days: "Jun 21-24", activities: "Colosseum, Vatican, Trevi Fountain" }].map(s => (
          <Card key={s.city} style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ fontSize: 28, width: 48, height: 48, background: TEAL_LIGHT, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.emoji}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{s.city}</div>
              <div style={{ fontSize: 12, color: GRAY_MED }}>{s.days}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{s.activities}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: "12px 16px", background: AMBER_LIGHT, borderRadius: 10, fontSize: 13, color: "#633806", textAlign: "center" }}>
        🔒 This is a read-only shared view. Sign up to create your own trip!
      </div>
    </div>
  );
}

// Page 12: Profile
function ProfilePage() {
  const [form, setForm] = useState({ name: "Arjun Kumar", email: "arjun@email.com", lang: "English", bio: "Travel enthusiast. 23 countries, 8 trips planned on Traveloop!" });
  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="Profile & Settings" subtitle="Manage your account and preferences" />
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: TEAL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff" }}>AK</div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, background: AMBER, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer" }}>✎</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{form.name}</div>
            <div style={{ color: GRAY_MED, fontSize: 13 }}>{form.email}</div>
            <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
              <Badge color="teal">11 countries</Badge>
              <Badge color="amber">8 trips</Badge>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, minHeight: 80, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Language Preference</label>
            <select value={form.lang} onChange={e => setForm({ ...form, lang: e.target.value })} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", background: "#fff" }}>
              {["English", "Hindi", "Tamil", "Spanish", "French", "Japanese"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn style={{ flex: 1 }}>Save Changes</Btn>
            <Btn variant="ghost">Change Password</Btn>
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Saved Destinations</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[{ name: "Santorini", emoji: "🏝️" }, { name: "Kyoto", emoji: "⛩️" }, { name: "Amalfi Coast", emoji: "🌊" }, { name: "Iceland", emoji: "🧊" }].map(d => (
            <div key={d.name} style={{ display: "flex", gap: 6, alignItems: "center", background: TEAL_LIGHT, borderRadius: 20, padding: "6px 14px", fontSize: 13, color: TEAL_DARK, fontWeight: 500 }}>
              {d.emoji} {d.name} <span style={{ cursor: "pointer", opacity: 0.6 }}>×</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #eee" }}>
          <Btn variant="danger" small>Delete Account</Btn>
        </div>
      </Card>
    </div>
  );
}

// Page 13: Trip Notes
function NotesPage() {
  const [notes, setNotes] = useState(tripNotes);
  const [adding, setAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", stop: "Paris" });
  const add = () => { if (newNote.title) { setNotes([...notes, { ...newNote, id: Date.now(), date: "Now" }]); setAdding(false); setNewNote({ title: "", content: "", stop: "Paris" }); } };
  return (
    <div>
      <PageHeader title="Trip Notes & Journal" subtitle="Europe Adventure · Your travel diary" actions={<Btn onClick={() => setAdding(true)}>+ Add Note</Btn>} />
      {adding && (
        <Card style={{ marginBottom: 20, border: `2px solid ${TEAL}` }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14, color: TEAL_DARK }}>New Note</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Input label="Title" placeholder="Note title..." value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Content</label>
              <textarea placeholder="Write your note..." value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", fontSize: 14, minHeight: 80, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn small onClick={add}>Save Note</Btn>
              <Btn small variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn>
            </div>
          </div>
        </Card>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {notes.map(n => (
          <Card key={n.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>📝 {n.title}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn small variant="ghost">✎</Btn>
                <Btn small variant="danger" onClick={() => setNotes(notes.filter(x => x.id !== n.id))}>✕</Btn>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.6, margin: "0 0 12px" }}>{n.content}</p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Badge color="teal">📍 {n.stop}</Badge>
              <span style={{ fontSize: 12, color: GRAY_MED }}>{n.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Page 14: Admin Dashboard
function AdminPage() {
  const stats = [
    { label: "Total Users", value: "1,284", change: "+12%", up: true },
    { label: "Trips Created", value: "4,720", change: "+8%", up: true },
    { label: "Active Today", value: "342", change: "-3%", up: false },
    { label: "Avg Trip Length", value: "12d", change: "+1d", up: true },
  ];
  const topCities = [
    { name: "Paris", count: 420, pct: 89 },
    { name: "Tokyo", count: 380, pct: 81 },
    { name: "Barcelona", count: 310, pct: 66 },
    { name: "New York", count: 290, pct: 62 },
    { name: "Bali", count: 260, pct: 55 },
  ];
  const users = [
    { name: "Arjun Kumar", email: "arjun@email.com", trips: 8, joined: "Jan 2025", status: "Active" },
    { name: "Priya Singh", email: "priya@email.com", trips: 5, joined: "Feb 2025", status: "Active" },
    { name: "Rohit Mehta", email: "rohit@email.com", trips: 3, joined: "Mar 2025", status: "Inactive" },
    { name: "Sneha Rao", email: "sneha@email.com", trips: 12, joined: "Dec 2024", status: "Active" },
  ];
  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Platform analytics and user management" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding: "1rem" }}>
            <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: s.up ? TEAL : "#E24B4A" }}>{s.up ? "↑" : "↓"} {s.change} vs last month</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Top Cities</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topCities.map((c, i) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span><span style={{ color: GRAY_MED, marginRight: 8 }}>#{i + 1}</span>{c.name}</span>
                  <span style={{ fontWeight: 600 }}>{c.count} trips</span>
                </div>
                <div style={{ background: GRAY_LIGHT, borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${c.pct}%`, background: TEAL, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Trip Status Distribution</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{ label: "Planning", count: 1840, color: AMBER }, { label: "Upcoming", count: 1260, color: TEAL }, { label: "Ongoing", count: 380, color: "#185FA5" }, { label: "Completed", count: 1240, color: GRAY_MED }].map(s => (
              <div key={s.label} style={{ background: GRAY_LIGHT, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, marginBottom: 8 }} />
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>{s.count.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: GRAY_MED }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>User Management</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee" }}>
              {["User", "Email", "Trips", "Joined", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: GRAY_MED, fontWeight: 600, fontSize: 12 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.email} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "12px 12px" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: TEAL_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: TEAL_DARK }}>{u.name.split(" ").map(n => n[0]).join("")}</div>
                    {u.name}
                  </div>
                </td>
                <td style={{ padding: "12px 12px", color: GRAY_MED }}>{u.email}</td>
                <td style={{ padding: "12px 12px", fontWeight: 600 }}>{u.trips}</td>
                <td style={{ padding: "12px 12px", color: GRAY_MED }}>{u.joined}</td>
                <td style={{ padding: "12px 12px" }}><Badge color={u.status === "Active" ? "teal" : "gray"}>{u.status}</Badge></td>
                <td style={{ padding: "12px 12px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn small variant="ghost">View</Btn>
                    <Btn small variant="danger">Ban</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("login");

  if (page === "login") return <LoginPage setPage={setPage} />;

  const pageMap = {
    dashboard: <DashboardPage setPage={setPage} />,
    trips: <TripsPage setPage={setPage} />,
    "create-trip": <CreateTripPage setPage={setPage} />,
    "itinerary-builder": <ItineraryBuilderPage setPage={setPage} />,
    "itinerary-view": <ItineraryViewPage setPage={setPage} />,
    "city-search": <CitySearchPage setPage={setPage} />,
    "activity-search": <ActivitySearchPage setPage={setPage} />,
    budget: <BudgetPage />,
    packing: <PackingPage />,
    shared: <SharedPage setPage={setPage} />,
    profile: <ProfilePage />,
    notes: <NotesPage />,
    admin: <AdminPage />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", background: "#f8f8f6" }}>
      <SideNav page={page} setPage={setPage} />
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxWidth: 1100 }}>
        {pageMap[page] || <DashboardPage setPage={setPage} />}
      </main>
    </div>
  );
}