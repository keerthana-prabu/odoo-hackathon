import { useState, useEffect } from "react";

const TEAL = "#1D9E75";
const TEAL_LIGHT = "#E1F5EE";
const TEAL_DARK = "#085041";
const AMBER = "#EF9F27";
const AMBER_LIGHT = "#FAEEDA";
const GRAY_LIGHT = "#F1EFE8";
const GRAY_MED = "#888780";

export default function ItineraryBuilderPage({ setPage, currentTrip }) {
  const [stops, setStops] = useState([]);
  const [cityQuery, setCityQuery] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState("");
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [activities, setActivities] = useState({});
  const [activityLoading, setActivityLoading] = useState({});
  const [expandedStop, setExpandedStop] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const tripId = currentTrip?.id || JSON.parse(localStorage.getItem("currentTripId") || "null");

 const searchCities = async (query) => {
  if (!query || query.length < 2) { setCityResults([]); return; }
  setCityLoading(true);
  setCityError("");
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
    );
    const data = await res.json();
    const results = (data.results || []).map(r => ({
      name: r.name,
      cityName: r.name,
      fullName: `${r.name}, ${r.admin1 || ""}, ${r.country}`,
      href: null,
      country: r.country,
      population: r.population,
      emoji: "🌍",
      costIndex: "Medium",
    }));
    setCityResults(results);
    setCities(results); // for CitySearchPage
  } catch {
    setCityError("Could not load cities. Check your internet.");
  }
  setCityLoading(false);
};

  const fetchActivities = async (city, stopIndex) => {
  setActivityLoading(prev => ({ ...prev, [stopIndex]: true }));
  // Using fixed activity categories - works without any API
  const cityName = city.cityName || city.name;
  setActivities(prev => ({
    ...prev,
    [stopIndex]: [
      { name: `${cityName} City Tour`, emoji: "🏛️", score: 85 },
      { name: `${cityName} Food Experience`, emoji: "🍽️", score: 80 },
      { name: "Local Markets", emoji: "🛍️", score: 75 },
      { name: "City Walking Tour", emoji: "🚶", score: 78 },
      { name: "Museums & Galleries", emoji: "🎨", score: 82 },
      { name: "Parks & Nature", emoji: "🌿", score: 70 },
      { name: "Photography Spots", emoji: "📸", score: 76 },
      { name: "Local Cuisine", emoji: "🥘", score: 88 },
    ]
  }));
  setActivityLoading(prev => ({ ...prev, [stopIndex]: false }));
};
  const getCategoryEmoji = (name) => ({
    "Leisure & Culture": "🎭", "Outdoors": "🏞️", "Travel Connectivity": "✈️",
    "Safety": "🛡️", "Healthcare": "🏥", "Education": "🎓",
    "Environmental Quality": "🌿", "Economy": "📈", "Internet Access": "📶",
    "Cost of Living": "💰", "Housing": "🏠", "Commute": "🚇",
    "Business Freedom": "📊", "Tolerance": "🤝", "Startups": "🚀",
  }[name] || "⭐");

  const getFallbackActivities = (stopIndex) => {
    const cityName = stops[stopIndex]?.cityName || "City";
    return [
      { name: `Explore ${cityName} Old Town`, emoji: "🏛️", score: 85 },
      { name: `${cityName} Food Tour`, emoji: "🍽️", score: 80 },
      { name: "Local Markets", emoji: "🛍️", score: 75 },
      { name: "City Walking Tour", emoji: "🚶", score: 78 },
      { name: "Museums & Galleries", emoji: "🎨", score: 82 },
      { name: "Parks & Nature", emoji: "🌿", score: 70 },
    ];
  };

  useEffect(() => {
    const timer = setTimeout(() => { if (cityQuery) searchCities(cityQuery); }, 400);
    return () => clearTimeout(timer);
  }, [cityQuery]);

  const addStop = (city) => {
  const newIndex = stops.length;
  setStops(prev => [...prev, {
    cityName: city.cityName || city.name,
    fullName: city.fullName || city.name,
    href: city.href || null,
    from: "", to: "",
    selectedActivities: [],
  }]);
  setShowCitySearch(false);
  setCityQuery("");
  setCityResults([]);
  setExpandedStop(newIndex);
  fetchActivities(city, newIndex); // pass whole city object
};
  const removeStop = (index) => {
    setStops(stops.filter((_, i) => i !== index));
    setActivities(prev => { const n = { ...prev }; delete n[index]; return n; });
  };

  const updateStop = (index, field, value) => {
    setStops(stops.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const toggleActivity = (stopIndex, activity) => {
    setStops(stops.map((s, i) => {
      if (i !== stopIndex) return s;
      const exists = s.selectedActivities.find(a => a.name === activity.name);
      return { ...s, selectedActivities: exists ? s.selectedActivities.filter(a => a.name !== activity.name) : [...s.selectedActivities, activity] };
    }));
  };

  const getDuration = (from, to) => {
    if (!from || !to) return null;
    const days = Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  };

  const saveItinerary = async () => {
    if (!tripId) { setSaveError("No trip found. Please create a trip first."); return; }
    setSaving(true);
    setSaveError("");
    const token = localStorage.getItem("token");
    try {
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        const stopRes = await fetch(`/api/trips/${tripId}/stops`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify({ city_name: stop.cityName, full_name: stop.fullName, emoji: "🌍", arrival_date: stop.from || null, departure_date: stop.to || null, position: i }),
        });
        if (!stopRes.ok) throw new Error("Failed to save stop: " + stop.cityName);
        const savedStop = await stopRes.json();
        for (const act of stop.selectedActivities) {
          await fetch(`/api/trips/${tripId}/stops/${savedStop.id}/activities`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
            body: JSON.stringify({ name: act.name, type: "Experience", emoji: act.emoji }),
          });
        }
      }
      setPage("itinerary-view");
    } catch (err) {
      setSaveError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Itinerary Builder</h1>
          <p style={{ color: GRAY_MED, fontSize: 14, margin: "4px 0 0" }}>Add cities and activities to build your trip</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowCitySearch(true)}
            style={{ background: TEAL_LIGHT, color: TEAL_DARK, border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            + Add City
          </button>
          {stops.length > 0 && (
            <button onClick={saveItinerary} disabled={saving}
              style={{ background: TEAL, color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 500, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving..." : "Save & Preview →"}
            </button>
          )}
        </div>
      </div>

      {/* Save Error */}
      {saveError && (
        <div style={{ background: "#FCEBEB", color: "#791F1F", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
          ⚠️ {saveError}
        </div>
      )}

      {/* City Search Modal */}
      {showCitySearch && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", width: 480, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Search a City</h3>
              <button onClick={() => { setShowCitySearch(false); setCityQuery(""); setCityResults([]); }}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: GRAY_MED }}>×</button>
            </div>
            <input autoFocus placeholder="🔍  Type a city name..." value={cityQuery}
              onChange={e => setCityQuery(e.target.value)}
              style={{ width: "100%", border: "1px solid #ddd", borderRadius: 8, padding: "11px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
            {cityLoading && <div style={{ textAlign: "center", padding: 16, color: GRAY_MED, fontSize: 14 }}>🔍 Searching cities...</div>}
            {cityError && <div style={{ color: "red", fontSize: 13, padding: "8px 0" }}>{cityError}</div>}
            {cityResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
                {cityResults.map((city, i) => (
                  <div key={i} onClick={() => addStop(city)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, cursor: "pointer", border: "1px solid #eee" }}
                    onMouseEnter={e => e.currentTarget.style.background = TEAL_LIGHT}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <span style={{ fontSize: 22 }}>🌍</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{city.cityName}</div>
                      <div style={{ fontSize: 12, color: GRAY_MED }}>{city.name}</div>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: TEAL, fontWeight: 500 }}>+ Add</span>
                  </div>
                ))}
              </div>
            )}
            {cityQuery.length > 1 && !cityLoading && cityResults.length === 0 && !cityError && (
              <div style={{ textAlign: "center", padding: 16, color: GRAY_MED, fontSize: 14 }}>No cities found for "{cityQuery}"</div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stops.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "2px dashed #ddd" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>No stops yet</h3>
          <p style={{ color: GRAY_MED, fontSize: 14, margin: "0 0 20px" }}>Click "Add City" to start building your itinerary</p>
          <button onClick={() => setShowCitySearch(true)}
            style={{ background: TEAL, color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            + Add First City
          </button>
        </div>
      )}

      {/* Stops */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {stops.map((stop, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, border: `2px solid ${expandedStop === i ? TEAL : "#eee"}`, overflow: "hidden" }}>
            <div onClick={() => setExpandedStop(expandedStop === i ? null : i)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, background: TEAL_LIGHT, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🌍</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Stop {i + 1}: {stop.cityName}</div>
                <div style={{ fontSize: 12, color: GRAY_MED }}>
                  {stop.from && stop.to ? `${stop.from} → ${stop.to} · ${getDuration(stop.from, stop.to)} days` : "Set travel dates below"}
                </div>
              </div>
              {stop.selectedActivities.length > 0 && (
                <span style={{ background: TEAL_LIGHT, color: TEAL_DARK, fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>
                  {stop.selectedActivities.length} activities
                </span>
              )}
              <button onClick={e => { e.stopPropagation(); removeStop(i); }}
                style={{ background: "#FCEBEB", color: "#791F1F", border: "none", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>
                Remove
              </button>
              <span style={{ color: GRAY_MED }}>{expandedStop === i ? "▲" : "▼"}</span>
            </div>

            {expandedStop === i && (
              <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f0f0f0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "16px 0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Arrival Date</label>
                    <input type="date" value={stop.from} onChange={e => updateStop(i, "from", e.target.value)}
                      style={{ border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>Departure Date</label>
                    <input type="date" value={stop.to} onChange={e => updateStop(i, "to", e.target.value)}
                      style={{ border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none" }} />
                  </div>
                </div>

                {getDuration(stop.from, stop.to) && (
                  <div style={{ background: TEAL_LIGHT, borderRadius: 8, padding: "8px 14px", fontSize: 13, color: TEAL_DARK, fontWeight: 500, marginBottom: 16 }}>
                    📅 {getDuration(stop.from, stop.to)} days in {stop.cityName}
                  </div>
                )}

                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
                  Suggested Activities
                  {activityLoading[i] && <span style={{ fontWeight: 400, color: GRAY_MED, fontSize: 12, marginLeft: 8 }}>Loading from API...</span>}
                </div>

                {activityLoading[i] ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[1,2,3,4].map(n => <div key={n} style={{ height: 36, width: 130, background: GRAY_LIGHT, borderRadius: 20 }} />)}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(activities[i] || []).map(act => {
                      const selected = stop.selectedActivities.find(a => a.name === act.name);
                      return (
                        <button key={act.name} onClick={() => toggleActivity(i, act)}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: 500, border: `2px solid ${selected ? TEAL : "#ddd"}`, background: selected ? TEAL_LIGHT : "#fff", color: selected ? TEAL_DARK : "#555" }}>
                          <span>{act.emoji}</span>
                          <span>{act.name}</span>
                          {selected && <span style={{ color: TEAL }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {stop.selectedActivities.length > 0 && (
                  <div style={{ marginTop: 14, padding: "10px 14px", background: AMBER_LIGHT, borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#633806", marginBottom: 6 }}>Selected:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {stop.selectedActivities.map(a => (
                        <span key={a.name} style={{ background: AMBER, color: "#fff", fontSize: 12, padding: "3px 10px", borderRadius: 12, fontWeight: 500 }}>
                          {a.emoji} {a.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {stops.length > 0 && (
        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <button onClick={() => setShowCitySearch(true)}
            style={{ background: TEAL_LIGHT, color: TEAL_DARK, border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            + Add Another City
          </button>
          <button onClick={saveItinerary} disabled={saving}
            style={{ flex: 1, background: TEAL, color: "#fff", border: "none", borderRadius: 8, padding: "11px 20px", fontSize: 15, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "Save & Preview Itinerary →"}
          </button>
        </div>
      )}
    </div>
  );
}