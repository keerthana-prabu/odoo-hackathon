import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

const TYPES = ["All", "Sightseeing", "Culture", "Food", "Experience"];

export default function ActivitySearchPage({ setPage }) {
  const [filter, setFilter] = useState("All");
  const [activities, setActivities] = useState([]);
  const [added, setAdded] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        // TODO: GET /api/activities?type=filter&city=currentCity
        // const res = await fetch("/api/activities?type=" + filter);
        // const data = await res.json();
        // setActivities(data);
      } catch (err) {
        console.error("Failed to load activities", err);
      }
      setLoading(false);
    };
    fetchActivities();
  }, [filter]);

  const toggle = (id) => setAdded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleAddToTrip = async () => {
    try {
      // TODO: POST /api/itinerary/activities
      // await fetch("/api/itinerary/activities", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
      //   body: JSON.stringify({ activityIds: added }),
      // });
      setPage("itinerary-builder");
    } catch (err) {
      console.error("Failed to add activities", err);
    }
  };

  return (
    <div>
      <PageHeader title="Activity Search" subtitle="Browse and add activities to your stops" />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "7px 16px", borderRadius: 20, border: "1px solid #ddd", fontSize: 13, cursor: "pointer", fontWeight: 500,
            background: filter === t ? TEAL : "#fff", color: filter === t ? "#fff" : "#555",
          }}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_MED }}>Loading activities...</div>
      ) : activities.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <p style={{ color: GRAY_MED, fontSize: 14 }}>Activities will appear here once the API is connected</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {activities.map(a => (
            <Card key={a.id} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontSize: 30, width: 52, height: 52, background: TEAL_LIGHT, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {a.emoji || "🎯"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: GRAY_MED, margin: "3px 0 6px" }}>📍 {a.city} · ⏱ {a.duration}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Badge color="teal">{a.type}</Badge>
                  <span style={{ fontSize: 12, fontWeight: 600, color: TEAL_DARK }}>${a.cost}</span>
                </div>
              </div>
              <button onClick={() => toggle(a.id)} style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0, cursor: "pointer", fontSize: 16,
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
        <div style={{ position: "sticky", bottom: 16, background: TEAL_DARK, color: "#fff", borderRadius: 12, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          <span style={{ fontWeight: 500 }}>{added.length} activit{added.length > 1 ? "ies" : "y"} selected</span>
          <Btn variant="amber" small onClick={handleAddToTrip}>Add to Stop →</Btn>
        </div>
      )}
    </div>
  );
}