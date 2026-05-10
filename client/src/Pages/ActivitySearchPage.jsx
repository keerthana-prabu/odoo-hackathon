import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

const TYPES = ["All", "Sightseeing", "Culture", "Food", "Experience"];

const MOCK_ACTIVITIES = [
  { id: 1, name: "Eiffel Tower Visit", city: "Paris", duration: "2 hrs", type: "Sightseeing", cost: 25, emoji: "🗼" },
  { id: 2, name: "Louvre Museum", city: "Paris", duration: "4 hrs", type: "Culture", cost: 17, emoji: "🏛️" },
  { id: 3, name: "Seine River Cruise", city: "Paris", duration: "1.5 hrs", type: "Experience", cost: 15, emoji: "🛥️" },
  { id: 4, name: "Café de Flore Breakfast", city: "Paris", duration: "1 hr", type: "Food", cost: 20, emoji: "☕" },
  { id: 5, name: "Colosseum Tour", city: "Rome", duration: "3 hrs", type: "Sightseeing", cost: 18, emoji: "🏟️" },
  { id: 6, name: "Vatican Museums", city: "Rome", duration: "4 hrs", type: "Culture", cost: 20, emoji: "🎨" },
  { id: 7, name: "Pasta Making Class", city: "Rome", duration: "2 hrs", type: "Experience", cost: 65, emoji: "🍝" },
  { id: 8, name: "Trastevere Food Walk", city: "Rome", duration: "2.5 hrs", type: "Food", cost: 35, emoji: "🍕" },
  { id: 9, name: "Sagrada Família", city: "Barcelona", duration: "2 hrs", type: "Sightseeing", cost: 26, emoji: "⛪" },
  { id: 10, name: "Picasso Museum", city: "Barcelona", duration: "2 hrs", type: "Culture", cost: 12, emoji: "🖼️" },
  { id: 11, name: "La Boqueria Market", city: "Barcelona", duration: "1 hr", type: "Food", cost: 0, emoji: "🥘" },
  { id: 12, name: "Flamenco Show", city: "Barcelona", duration: "2 hrs", type: "Experience", cost: 45, emoji: "💃" },
  { id: 13, name: "Acropolis Tour", city: "Athens", duration: "3 hrs", type: "Sightseeing", cost: 20, emoji: "🏛️" },
  { id: 14, name: "Greek Cooking Class", city: "Athens", duration: "3 hrs", type: "Experience", cost: 55, emoji: "🫒" },
  { id: 15, name: "Monastiraki Street Food", city: "Athens", duration: "1.5 hrs", type: "Food", cost: 15, emoji: "🥙" },
  { id: 16, name: "Santorini Sunset Sail", city: "Santorini", duration: "4 hrs", type: "Experience", cost: 80, emoji: "🌅" },
];

export default function ActivitySearchPage({ setPage }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState([]);
  const [added, setAdded] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate a network delay so it looks real
    const timer = setTimeout(() => {
      setActivities(MOCK_ACTIVITIES);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = activities.filter(a => {
    const matchesType = filter === "All" || a.type === filter;
    const matchesSearch = search.trim() === "" ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const toggle = (id) => setAdded(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const handleAddToTrip = () => {
    setPage("itinerary-builder");
  };

  return (
    <div>
      <PageHeader title="Activity Search" subtitle="Browse and add activities to your stops" />

      {/* Search bar */}
      <input
        placeholder="🔍  Search activities or cities..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%", marginBottom: 16, border: "1px solid #ddd",
          borderRadius: 10, padding: "11px 16px", fontSize: 14,
          outline: "none", boxSizing: "border-box",
        }}
      />

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "7px 16px", borderRadius: 20, border: "1px solid #ddd",
            fontSize: 13, cursor: "pointer", fontWeight: 500,
            background: filter === t ? TEAL : "#fff",
            color: filter === t ? "#fff" : "#555",
          }}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_MED }}>Loading activities...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <p style={{ color: GRAY_MED, fontSize: 14 }}>No activities match your search</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {filtered.map(a => (
            <Card key={a.id} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{
                fontSize: 30, width: 52, height: 52, background: TEAL_LIGHT,
                borderRadius: 12, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                {a.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: GRAY_MED, margin: "3px 0 6px" }}>
                  📍 {a.city} · ⏱ {a.duration}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Badge color="teal">{a.type}</Badge>
                  <span style={{ fontSize: 12, fontWeight: 600, color: TEAL_DARK }}>
                    {a.cost === 0 ? "Free" : `$${a.cost}`}
                  </span>
                </div>
              </div>
              <button onClick={() => toggle(a.id)} style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                cursor: "pointer", fontSize: 16,
                border: `2px solid ${added.includes(a.id) ? TEAL : "#ddd"}`,
                background: added.includes(a.id) ? TEAL : "#fff",
                color: added.includes(a.id) ? "#fff" : GRAY_MED,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {added.includes(a.id) ? "✓" : "+"}
              </button>
            </Card>
          ))}
        </div>
      )}

      {added.length > 0 && (
        <div style={{
          position: "sticky", bottom: 16, background: TEAL_DARK, color: "#fff",
          borderRadius: 12, padding: "14px 20px", display: "flex",
          justifyContent: "space-between", alignItems: "center", marginTop: 20,
        }}>
          <span style={{ fontWeight: 500 }}>
            {added.length} activit{added.length > 1 ? "ies" : "y"} selected
          </span>
          <Btn variant="amber" small onClick={handleAddToTrip}>Add to Stop →</Btn>
        </div>
      )}
    </div>
  );
}