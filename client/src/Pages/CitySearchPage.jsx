import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

export default function CitySearchPage({ setPage }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length < 2) { setCities([]); return; }
      searchCities(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const searchCities = async (q) => {
    setLoading(true);
    try {
      // Using Teleport API — no key needed
      const res = await fetch(`https://api.teleport.org/api/cities/?search=${encodeURIComponent(q)}&limit=12`);
      const data = await res.json();
      const results = (data._embedded?.["city:search-results"] || []).map(r => ({
        name: r.matching_full_name.split(",")[0].trim(),
        fullName: r.matching_full_name,
        href: r._links["city:item"].href,
        // TODO: cost index will come from your backend /api/cities/:name/cost
        costIndex: "Medium",
        emoji: "🌍",
      }));
      setCities(results);
    } catch (err) {
      console.error("City search failed", err);
    }
    setLoading(false);
  };

  const filtered = filter === "All" ? cities : cities.filter(c => c.costIndex === filter);

  return (
    <div>
      <PageHeader title="City Search" subtitle="Discover and add cities to your itinerary" />

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input placeholder="🔍  Search cities or countries..." value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, border: "1px solid #ddd", borderRadius: 10, padding: "11px 16px", fontSize: 14, outline: "none" }} />
        {["All", "Low", "Medium", "High"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, cursor: "pointer", fontWeight: 500,
            background: filter === f ? TEAL : "#fff", color: filter === f ? "#fff" : "#555",
          }}>{f} Cost</button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", padding: 40, color: GRAY_MED }}>Searching cities...</div>}

      {!loading && query.length > 1 && cities.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: GRAY_MED }}>No cities found for "{query}"</div>
      )}

      {!loading && query.length < 2 && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
          <p style={{ color: GRAY_MED, fontSize: 14 }}>Type a city name to start searching</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map((c, i) => (
          <Card key={i} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ background: TEAL_LIGHT, height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{c.emoji}</div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                <Badge color={c.costIndex === "High" ? "red" : c.costIndex === "Low" ? "green" : "amber"}>{c.costIndex}</Badge>
              </div>
              <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 12 }}>{c.fullName}</div>
              {/* TODO: show real activities once /api/cities/:name/activities is ready */}
              <Btn small style={{ width: "100%" }} onClick={() => setPage("itinerary-builder")}>+ Add to Trip</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}