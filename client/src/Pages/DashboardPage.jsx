import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, AMBER, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

export default function DashboardPage({ setPage, setCurrentTrip }) {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, citiesVisited: 0, countries: 0, budgetSaved: 0 });
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
       const res = await fetch("/api/trips/dashboard", {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
const data = await res.json();
setTrips(data.recentTrips);
setStats(data.stats);
setRecommended(data.recommended);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { label: "Total Trips",   value: stats.totalTrips,    icon: "🗺️" },
    { label: "Cities Visited",value: stats.citiesVisited, icon: "🌍" },
    { label: "Countries",     value: stats.countries,     icon: "🏳️" },
    { label: "Budget Saved",  value: `$${stats.budgetSaved}`, icon: "💰" },
  ];

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`, borderRadius: 16, padding: "28px 28px 24px", marginBottom: 28, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Good morning 👋</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Welcome back!</h2>
        <p style={{ fontSize: 14, opacity: 0.8, margin: "0 0 20px" }}>Ready to plan your next adventure?</p>
        <Btn onClick={() => setPage("create-trip")} variant="amber">+ Plan New Trip</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {statCards.map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "1rem" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: TEAL_DARK }}>
              {loading ? "—" : s.value}
            </div>
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

          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: GRAY_MED }}>Loading trips...</div>
          ) : trips.length === 0 ? (
            <Card style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🗺️</div>
              <p style={{ color: GRAY_MED, fontSize: 14, margin: "0 0 16px" }}>No trips yet. Start planning!</p>
              <Btn onClick={() => setPage("create-trip")}>+ Create First Trip</Btn>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {trips.map(t => (
                <Card key={t.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px" }}
                  onClick={() => { setCurrentTrip(t); setPage("itinerary-view"); }}>
                  <div style={{ fontSize: 28, width: 48, height: 48, background: TEAL_LIGHT, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {t.cover || "🌍"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: GRAY_MED, marginTop: 2 }}>{t.dates} · {t.cities} cities</div>
                  </div>
                  <Badge color={t.status === "Completed" ? "gray" : t.status === "Upcoming" ? "teal" : "amber"}>{t.status}</Badge>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 600 }}>Recommended Destinations</h3>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: GRAY_MED }}>Loading...</div>
          ) : recommended.length === 0 ? (
            <Card style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: GRAY_MED, fontSize: 14, margin: 0 }}>Recommendations will appear here</p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recommended.map(r => (
                <Card key={r.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
                  <div style={{ fontSize: 24 }}>{r.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: GRAY_MED }}>{r.country}</div>
                  </div>
                  <Badge color="teal">{r.vibe}</Badge>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}