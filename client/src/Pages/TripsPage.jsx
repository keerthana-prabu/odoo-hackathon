import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

export default function TripsPage({ setPage, setCurrentTrip }) {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const tabs = ["All", "Upcoming", "Planning", "Completed"];

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
       const res = await fetch("/api/trips", {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
const data = await res.json();
setTrips(data);
      } catch (err) {
        console.error("Failed to load trips", err);
      }
      setLoading(false);
    };
    fetchTrips();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this trip?")) return;
    try {
     await fetch("/api/trips/" + id, {
  method: "DELETE",
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
setTrips(trips.filter(t => t.id !== id));
      setTrips(trips.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete trip", err);
    }
  };

  const filtered = filter === "All" ? trips : trips.filter(t => t.status === filter);

  return (
    <div>
      <PageHeader title="My Trips" subtitle="All your travel plans in one place"
        actions={<Btn onClick={() => setPage("create-trip")}>+ New Trip</Btn>} />

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "7px 16px", borderRadius: 20, border: "1px solid #ddd", fontSize: 13, cursor: "pointer", fontWeight: 500,
            background: filter === t ? TEAL : "#fff", color: filter === t ? "#fff" : "#555",
          }}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_MED }}>Loading your trips...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
          <p style={{ color: GRAY_MED, fontSize: 14, marginBottom: 20 }}>No trips found</p>
          <Btn onClick={() => setPage("create-trip")}>+ Create a Trip</Btn>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {filtered.map(t => (
            <Card key={t.id} style={{ padding: 0, overflow: "hidden" }}
              onClick={() => { setCurrentTrip(t); setPage("itinerary-view"); }}>
              <div style={{ height: 110, background: TEAL_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>
                {t.cover || "🌍"}
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                  <Badge color={t.status === "Completed" ? "gray" : t.status === "Upcoming" ? "teal" : "amber"}>{t.status}</Badge>
                </div>
                <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 10 }}>{t.dates}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: GRAY_MED }}>
                  <span>🌍 {t.cities} cities</span>
                  <span>💰 ${t.budget?.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  <Btn small variant="secondary" onClick={e => { e.stopPropagation(); setCurrentTrip(t); setPage("itinerary-view"); }}>View</Btn>
                  <Btn small variant="ghost" onClick={e => { e.stopPropagation(); setCurrentTrip(t); setPage("itinerary-builder"); }}>Edit</Btn>
                  <Btn small variant="danger" onClick={e => handleDelete(t.id, e)}>Delete</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}