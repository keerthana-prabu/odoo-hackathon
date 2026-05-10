import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

const TYPE_COLORS = { Travel: "gray", Experience: "teal", Culture: "amber", Sightseeing: "green", Food: "red" };

export default function ItineraryViewPage({ setPage, currentTrip }) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    if (!currentTrip?.id) { setLoading(false); return; }
    const fetchItinerary = async () => {
      setLoading(true);
      try {
      const res = await fetch(`/api/trips/${currentTrip.id}/itinerary`, {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
const data = await res.json();
setDays(data.days);
      } catch (err) {
        console.error("Failed to load itinerary", err);
      }
      setLoading(false);
    };
    fetchItinerary();
  }, [currentTrip]);

  return (
    <div>
      <PageHeader
        title={currentTrip?.name || "Itinerary"}
        subtitle={currentTrip ? `${currentTrip.dates} · ${currentTrip.cities} cities · $${currentTrip.budget} budget` : ""}
        actions={
          <>
            <div style={{ display: "flex", background: "#F1EFE8", borderRadius: 8, padding: 3 }}>
              {["list", "calendar"].map(m => (
                <button key={m} onClick={() => setViewMode(m)} style={{
                  padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
                  background: viewMode === m ? "#fff" : "transparent", color: viewMode === m ? TEAL_DARK : GRAY_MED,
                }}>
                  {m === "list" ? "📋 List" : "📅 Calendar"}
                </button>
              ))}
            </div>
            <Btn variant="secondary" onClick={() => setPage("shared")}>🔗 Share</Btn>
            <Btn onClick={() => setPage("itinerary-builder")}>Edit</Btn>
          </>
        }
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_MED }}>Loading itinerary...</div>
      ) : days.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p style={{ color: GRAY_MED, fontSize: 14, marginBottom: 20 }}>No itinerary built yet</p>
          <Btn onClick={() => setPage("itinerary-builder")}>Build Itinerary</Btn>
        </div>
      ) : (
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
                    <Badge color={TYPE_COLORS[a.type] || "gray"}>{a.type}</Badge>
                    {a.cost > 0 && <div style={{ fontSize: 13, fontWeight: 600, color: TEAL_DARK }}>${a.cost}</div>}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}