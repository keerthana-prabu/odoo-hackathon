import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

const CAT_ICONS = { Clothing: "👕", Documents: "📄", Electronics: "🔌", Toiletries: "🧴", Misc: "📦" };

export default function PackingPage({ currentTrip }) {
  const [categories, setCategories] = useState({});
  const [checked, setChecked] = useState({});
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Misc" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacking = async () => {
      setLoading(true);
      try {
     const res = await fetch(`/api/trips/${currentTrip.id}/packing`, {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
const data = await res.json();
setCategories(data.categories);
setChecked(data.checked);
      } catch (err) {
        console.error("Failed to load packing list", err);
      }
      setLoading(false);
    };
    if (currentTrip?.id) fetchPacking();
    else setLoading(false);
  }, [currentTrip]);

  const toggle = async (key) => {
  
const next = { ...checked, [key]: !checked[key] };
setChecked(next);
const [category, ...rest] = key.split(/(?=[A-Z])/);
await fetch(`/api/trips/${currentTrip.id}/packing/checked`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  body: JSON.stringify({ name: rest.join(""), category, is_checked: next[key] }),
});  };

  const addItem = async () => {
    if (!newItem.name.trim()) return;
    const res = await fetch(`/api/trips/${currentTrip.id}/packing`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
  body: JSON.stringify({ name: newItem.name, category: newItem.category }),
});
const saved = await res.json();
const updated = { ...categories, [newItem.category]: [...(categories[newItem.category] || []), saved.name] };
setCategories(updated);
setNewItem({ name: "", category: "Misc" });
setAdding(false); };

  const totalItems = Object.values(categories).flat().length;
  const packedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <PageHeader title="Packing Checklist" subtitle={currentTrip?.name || "Select a trip"}
        actions={
          <>
            <Btn variant="ghost" small onClick={() => setAdding(true)}>+ Add Item</Btn>
            <Btn variant="danger" small onClick={() => setChecked({})}>Reset</Btn>
          </>
        }
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_MED }}>Loading packing list...</div>
      ) : totalItems === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎒</div>
          <p style={{ color: GRAY_MED, fontSize: 14 }}>No packing list yet. Add items to get started!</p>
          <Btn onClick={() => setAdding(true)} style={{ marginTop: 16 }}>+ Add First Item</Btn>
        </div>
      ) : (
        <>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{packedCount} / {totalItems} packed</div>
                <div style={{ fontSize: 13, color: GRAY_MED }}>
                  {packedCount === totalItems ? "All packed! You're ready! 🎉" : "Keep going!"}
                </div>
              </div>
              <div style={{ position: "relative", width: 64, height: 64 }}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#eee" strokeWidth="8" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke={TEAL} strokeWidth="8"
                    strokeDasharray={`${totalItems > 0 ? Math.round((packedCount / totalItems) * 175.9) : 0} 175.9`}
                    strokeLinecap="round" transform="rotate(-90 32 32)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>
                  {totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0}%
                </div>
              </div>
            </div>
          </Card>

          {adding && (
            <Card style={{ marginBottom: 16, border: `2px solid ${TEAL}` }}>
              <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="Item name..." value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none" }} />
                <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  style={{ border: "1px solid #ddd", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none" }}>
                  {Object.keys(CAT_ICONS).map(c => <option key={c}>{c}</option>)}
                </select>
                <Btn small onClick={addItem}>Add</Btn>
                <Btn small variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn>
              </div>
            </Card>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {Object.entries(categories).map(([cat, items]) => (
              <Card key={cat}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", gap: 8, alignItems: "center" }}>
                  <span>{CAT_ICONS[cat] || "📦"}</span>
                  {cat}
                  <Badge color="gray">{items.filter(i => checked[cat + i]).length}/{items.length}</Badge>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map(item => {
                    const key = cat + item;
                    return (
                      <div key={item} onClick={() => toggle(key)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff",
                          border: `2px solid ${checked[key] ? TEAL : "#ddd"}`, background: checked[key] ? TEAL : "#fff" }}>
                          {checked[key] ? "✓" : ""}
                        </div>
                        <span style={{ fontSize: 14, color: checked[key] ? GRAY_MED : "#333", textDecoration: checked[key] ? "line-through" : "none" }}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}