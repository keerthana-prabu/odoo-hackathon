import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, AMBER, AMBER_LIGHT, GRAY_MED } from "../Components/constants";
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
       const res = await fetch(`/api/trips/${currentTrip.id}/stops`);
const data = await res.json();
setStops(data);
      } catch (err) {
        console.error(err);
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

  return (
    <div>
      <PageHeader title="Shared Itinerary" subtitle="Share your trip with friends" />

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, background: "#F1EFE8", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: GRAY_MED, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {shareUrl}
          </div>
          <Btn onClick={copyLink} variant="secondary">{copied ? "✓ Copied!" : "📋 Copy Link"}</Btn>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {["Twitter", "WhatsApp", "Email"].map(s => (
            <Btn key={s} small variant="ghost">Share on {s}</Btn>
          ))}
        </div>
      </Card>

      {currentTrip && (
        <div style={{ background: TEAL_LIGHT, border: `2px solid ${TEAL}`, borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ fontSize: 44 }}>{currentTrip.cover || "🌍"}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: TEAL_DARK }}>{currentTrip.name}</div>
              <div style={{ color: GRAY_MED, fontSize: 14 }}>{currentTrip.dates}</div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <span style={{ fontSize: 13 }}>🌍 {currentTrip.cities} cities</span>
                <span style={{ fontSize: 13 }}>💰 ${currentTrip.budget?.toLocaleString()} budget</span>
              </div>
            </div>
            <Btn style={{ marginLeft: "auto" }}>📋 Copy Trip</Btn>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: GRAY_MED }}>Loading...</div>
      ) : stops.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ color: GRAY_MED, fontSize: 14 }}>No stops to display yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {stops.map((s, i) => (
            <Card key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontSize: 28, width: 48, height: 48, background: TEAL_LIGHT, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.emoji || "🌍"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.city}</div>
                <div style={{ fontSize: 12, color: GRAY_MED }}>{s.days}</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{s.activities?.join(", ")}</div>
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