import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, GRAY_MED } from "../Components/constants";
import PageHeader from "../Components/PageHeader";
import Btn from "../Components/Btn";

const MOCK_INVOICE = {
  invoiceId: "INV-tvl-30290",
  generatedDate: "May 10, 2026",
  paymentStatus: "Pending",
  travelers: ["You"],
  totalBudget: 20000,
  items: [
    { id: 1, category: "Hotel", description: "Hotel booking Paris", qty: "3 nights", unitCost: 3000, amount: 9000 },
    { id: 2, category: "Travel", description: "Flight bookings (DEL → PAR)", qty: "1", unitCost: 12000, amount: 12000 },
    { id: 3, category: "Food", description: "Meal allowance", qty: "7 days", unitCost: 50, amount: 350 },
    { id: 4, category: "Activities", description: "Tours & entry tickets", qty: "4", unitCost: 30, amount: 120 },
  ],
  taxRate: 0.05,
  discount: 50,
};

const CATEGORY_COLORS = {
  Hotel: TEAL,
  Travel: "#E2794B",
  Food: "#5B8FE8",
  Activities: "#A259E6",
};

export default function BudgetPage({ currentTrip, setPage }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!currentTrip?.id) { setLoading(false); return; }

    // Try real API first, fall back to mock
    fetch(`/api/trips/${currentTrip.id}/budget`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then(r => r.json())
      .then(data => {
        // If API returns meaningful data use it, else use mock
        if (data?.items?.length > 0) setInvoice(data);
        else setInvoice({ ...MOCK_INVOICE, tripName: currentTrip.name });
      })
      .catch(() => setInvoice({ ...MOCK_INVOICE, tripName: currentTrip.name }))
      .finally(() => setLoading(false));
  }, [currentTrip]);

  if (!currentTrip?.id) return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
      <p style={{ color: GRAY_MED, fontSize: 14, marginBottom: 20 }}>Select a trip to view its budget invoice</p>
      <Btn onClick={() => setPage("trips")}>Go to My Trips</Btn>
    </div>
  );

  if (loading) return (
    <div style={{ textAlign: "center", padding: 80, color: GRAY_MED }}>Loading budget...</div>
  );

  const inv = invoice;
  const subtotal = inv.items.reduce((s, i) => s + i.amount, 0);
  const tax = Math.round(subtotal * inv.taxRate);
  const grandTotal = subtotal + tax - inv.discount;
  const totalSpent = grandTotal;
  const remaining = inv.totalBudget - totalSpent;
  const pct = Math.min(100, Math.round((totalSpent / inv.totalBudget) * 100));

  // Simple SVG pie chart
  const PIE_R = 50;
  const PIE_CX = 60;
  const PIE_CY = 60;
  let cumAngle = -90;
  const slices = inv.items.map(item => {
    const frac = item.amount / subtotal;
    const angle = frac * 360;
    const start = cumAngle;
    cumAngle += angle;
    const toRad = d => (d * Math.PI) / 180;
    const x1 = PIE_CX + PIE_R * Math.cos(toRad(start));
    const y1 = PIE_CY + PIE_R * Math.sin(toRad(start));
    const x2 = PIE_CX + PIE_R * Math.cos(toRad(cumAngle - 0.01));
    const y2 = PIE_CY + PIE_R * Math.sin(toRad(cumAngle - 0.01));
    const large = angle > 180 ? 1 : 0;
    return {
      path: `M${PIE_CX},${PIE_CY} L${x1},${y1} A${PIE_R},${PIE_R} 0 ${large} 1 ${x2},${y2} Z`,
      color: CATEGORY_COLORS[item.category] || TEAL,
      label: item.category,
      pct: Math.round(frac * 100),
    };
  });

  return (
    <div>
      <PageHeader
        title="Budget & Invoice"
        subtitle={currentTrip?.name || "Trip Invoice"}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" small onClick={() => setPage("trips")}>← Back to My Trips</Btn>
            <Btn small onClick={() => window.print()}>⬇ Download Invoice</Btn>
            <Btn variant="secondary" small onClick={() => window.print()}>Export as PDF</Btn>
          </div>
        }
      />

      {/* Top: Invoice header + Budget insights */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, marginBottom: 20 }}>

        {/* Invoice header card */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: 20, alignItems: "start" }}>
            <div style={{ width: 80, height: 80, background: TEAL_LIGHT, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
              ✈️
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{currentTrip.name || "Trip Adventure"}</div>
              <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 12 }}>{currentTrip.dates || "May 2026"}</div>
              <div style={{ fontSize: 12, color: "#555", fontWeight: 500, marginBottom: 4 }}>Traveler Details:</div>
              {inv.travelers.map(t => (
                <div key={t} style={{ fontSize: 13, color: "#333" }}>{t}</div>
              ))}
            </div>
            <div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: GRAY_MED }}>Invoice ID</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.invoiceId}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: GRAY_MED }}>Generated Date</div>
                <div style={{ fontSize: 13 }}>{inv.generatedDate}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: GRAY_MED }}>Payment Status</div>
                <span style={{ fontSize: 12, fontWeight: 600, background: "#FFF3CD", color: "#856404", padding: "2px 10px", borderRadius: 20 }}>
                  {inv.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget insights */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: "20px 24px", minWidth: 220 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: TEAL_DARK }}>Budget Insights</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
              <circle cx={PIE_CX} cy={PIE_CY} r={22} fill="#fff" />
              <text x={PIE_CX} y={PIE_CY + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={TEAL_DARK}>{pct}%</text>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {slices.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <span style={{ color: "#555" }}>{s.label} {s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: GRAY_MED }}>
            Total Budget: <b style={{ color: "#333" }}>${inv.totalBudget.toLocaleString()}</b>
          </div>
          <div style={{ fontSize: 12, color: GRAY_MED }}>
            Total Spent: <b style={{ color: totalSpent > inv.totalBudget ? "#E24B4A" : TEAL_DARK }}>${totalSpent.toLocaleString()}</b>
          </div>
          <div style={{ fontSize: 12, color: GRAY_MED }}>
            Remaining: <b style={{ color: remaining < 0 ? "#E24B4A" : "#333" }}>${remaining.toLocaleString()}</b>
          </div>
          <Btn small style={{ marginTop: 12, width: "100%" }} onClick={() => {}}>View Full Budget</Btn>
        </div>
      </div>

      {/* Line items table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", overflow: "hidden", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f5f5f3" }}>
              {["#", "Category", "Description", "Qty / Details", "Unit Cost", "Amount"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: h === "#" ? "center" : "left", fontWeight: 600, color: "#555", fontSize: 12, borderBottom: "1px solid #eee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inv.items.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "13px 16px", textAlign: "center", color: GRAY_MED }}>{i + 1}</td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{ background: TEAL_LIGHT, color: TEAL_DARK, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6 }}>{item.category}</span>
                </td>
                <td style={{ padding: "13px 16px", color: "#333" }}>{item.description}</td>
                <td style={{ padding: "13px 16px", color: GRAY_MED }}>{item.qty}</td>
                <td style={{ padding: "13px 16px", color: "#333" }}>${item.unitCost.toLocaleString()}</td>
                <td style={{ padding: "13px 16px", fontWeight: 600, color: TEAL_DARK }}>${item.amount.toLocaleString()}</td>
              </tr>
            ))}
            {/* Empty rows to look like wireframe */}
            {[...Array(Math.max(0, 6 - inv.items.length))].map((_, i) => (
              <tr key={"empty-" + i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                {[...Array(6)].map((_, j) => <td key={j} style={{ padding: "13px 16px", color: "transparent" }}>—</td>)}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 24px", borderTop: "2px solid #eee" }}>
          <div style={{ width: 240 }}>
            {[
              ["Subtotal", `$${subtotal.toLocaleString()}`],
              [`Tax (${Math.round(inv.taxRate * 100)}%)`, `$${tax.toLocaleString()}`],
              ["Discount", `-$${inv.discount}`],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: GRAY_MED, marginBottom: 6 }}>
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: TEAL_DARK, paddingTop: 8, borderTop: "1px solid #eee", marginTop: 4 }}>
              <span>Grand Total</span><span>${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={() => window.print()}>⬇ Download Invoice</Btn>
          <Btn variant="secondary" onClick={() => window.print()}>Export as PDF</Btn>
        </div>
        <Btn onClick={() => {
          // Toggle payment status
          setInvoice(prev => ({ ...prev, paymentStatus: prev.paymentStatus === "Pending" ? "Paid" : "Pending" }));
        }}
          style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {invoice?.paymentStatus === "Paid" ? "✓ Marked as Paid" : "Mark as Paid"}
        </Btn>
      </div>
    </div>
  );
}