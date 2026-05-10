import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, AMBER_LIGHT, GRAY_LIGHT, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import PageHeader from "../Components/PageHeader";

export default function BudgetPage({ currentTrip }) {
  const [breakdown, setBreakdown] = useState([]);
  const [cityBreakdown, setCityBreakdown] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentTrip?.id) { setLoading(false); return; }
    const fetchBudget = async () => {
      setLoading(true);
      try {
       const res = await fetch(`/api/trips/${currentTrip.id}/budget`, {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
const data = await res.json();
setBreakdown(data.breakdown);
setCityBreakdown(data.byCity);
setTotalBudget(data.budget);
setTotalSpent(data.spent);
      } catch (err) {
        console.error("Failed to load budget", err);
      }
      setLoading(false);
    };
    fetchBudget();
  }, [currentTrip]);

  const pct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div>
      <PageHeader title="Budget & Cost Breakdown"
        subtitle={currentTrip?.name || "Select a trip to view budget"} />

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_MED }}>Loading budget...</div>
      ) : !currentTrip ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
          <p style={{ color: GRAY_MED, fontSize: 14 }}>Select a trip to view its budget breakdown</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, marginBottom: 24 }}>
            <Card>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 12, color: GRAY_MED }}>Total Estimated</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: TEAL_DARK }}>${totalSpent.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: GRAY_MED }}>of ${totalBudget.toLocaleString()} budget</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: pct > 90 ? "#E24B4A" : TEAL }}>{pct}% used</div>
                  </div>
                </div>
                <div style={{ background: GRAY_LIGHT, borderRadius: 8, height: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pct > 90 ? "#E24B4A" : TEAL, borderRadius: 8, transition: "width 0.5s" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: TEAL_LIGHT, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, color: TEAL_DARK, fontWeight: 500 }}>Avg per day</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: TEAL_DARK }}>
                    {currentTrip.days ? `$${Math.round(totalSpent / currentTrip.days)}` : "—"}
                  </div>
                </div>
                <div style={{ background: GRAY_LIGHT, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>Remaining</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#333" }}>${(totalBudget - totalSpent).toLocaleString()}</div>
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Breakdown by Category</div>
              {breakdown.length === 0 ? (
                <p style={{ color: GRAY_MED, fontSize: 13 }}>No expense data yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {breakdown.map(b => (
                    <div key={b.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <span style={{ color: "#333" }}>{b.icon} {b.label}</span>
                        <span style={{ fontWeight: 600 }}>${b.amount}</span>
                      </div>
                      <div style={{ background: GRAY_LIGHT, borderRadius: 4, height: 6, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${totalSpent > 0 ? Math.round((b.amount / totalSpent) * 100) : 0}%`, background: b.color || TEAL, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Cost by City</div>
            {cityBreakdown.length === 0 ? (
              <p style={{ color: GRAY_MED, fontSize: 13 }}>No city data yet</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {cityBreakdown.map(c => (
                  <div key={c.city} style={{ background: TEAL_LIGHT, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{c.emoji || "🌍"}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: TEAL_DARK }}>{c.city}</div>
                    <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 8 }}>{c.days} days</div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: TEAL_DARK }}>${c.cost}</div>
                    <div style={{ fontSize: 11, color: GRAY_MED }}>${Math.round(c.cost / c.days)}/day avg</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}