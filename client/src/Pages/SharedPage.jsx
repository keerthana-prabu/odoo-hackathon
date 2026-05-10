import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, AMBER_LIGHT, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

export default function SharedPage({ currentTrip }) {
  const [stops, setStops] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const shareUrl = currentTrip
    ? `https://traveloop.app/shared/${currentTrip.id}`
    : "https://traveloop.app/shared/—";

  useEffect(() => {
    if (!currentTrip?.id) { setLoading(false); return; }
    const fetchShared = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/trips/${currentTrip.id}/stops`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        const data = await res.json();
        setStops(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setStops([]);
      }
      setLoading(false);
    };
    fetchShared();
  }, [currentTrip]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentTrip) {
    return (
      <div>
        <PageHeader title="Shared Itinerary" subtitle="Share your trip with friends" />
        <Card style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔗</div>
          <p style={{ color: GRAY_MED, fontSize: 14, margin: "0 0 16px" }}>
            Select a trip from My Trips to share it
          </p>
          <div style={{ fontSize: 13, color: GRAY_MED }}>
            Go to My Trips → click a trip → then come back here
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Shared Itinerary" subtitle="Share your trip with friends" />

      {/* Share Link */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            flex: 1, background: "#F1EFE8", borderRadius: 8, padding: "10px 14px",
            fontSize: 13, color: GRAY_MED, fontFamily: "monospace",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>
            {shareUrl}
          </div>
          <Btn onClick={copyLink} variant="secondary">
            {copied ? "✓ Copied!" : "📋 Copy Link"}
          </Btn>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {["Twitter", "WhatsApp", "Email"].map(s => (
            <Btn key={s} small variant="ghost">Share on {s}</Btn>
          ))}
        </div>
      </Card>

      {/* Trip Summary */}
      <div style={{ background: TEAL_LIGHT, border: `2px solid ${TEAL}`, borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontSize: 44 }}>{currentTrip.cover || "🌍"}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: TEAL_DARK }}>{currentTrip.name}</div>
            <div style={{ color: GRAY_MED, fontSize: 14 }}>{currentTrip.dates || ""}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <span style={{ fontSize: 13 }}>🌍 {currentTrip.cities || 0} cities</span>
              <span style={{ fontSize: 13 }}>💰 ${Number(currentTrip.budget || 0).toLocaleString()} budget</span>
            </div>
          </div>
          <Btn style={{ marginLeft: "auto" }}>📋 Copy Trip</Btn>
        </div>
      </div>

      {/* Stops */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: GRAY_MED }}>Loading stops...</div>
      ) : stops.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🗺️</div>
          <p style={{ color: GRAY_MED, fontSize: 14 }}>No stops added to this trip yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {stops.map((s, i) => (
            <Card key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{
                fontSize: 28, width: 48, height: 48, background: TEAL_LIGHT,
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {s.emoji || "🌍"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.city_name}</div>
                <div style={{ fontSize: 12, color: GRAY_MED }}>
                  {s.arrival_date && s.departure_date
                    ? `${s.arrival_date} → ${s.departure_date}`
                    : "Dates not set"}
                </div>
                {s.activities?.length > 0 && (
                  <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
                    {s.activities.map(a => a.name).join(", ")}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, padding: "12px 16px", background: AMBER_LIGHT, borderRadius: 10, fontSize: 13, color: "#633806", textAlign: "center" }}>
        🔒 This is a read-only shared view. Sign up to create your own trip!
      </div>
    </div>
  );
}