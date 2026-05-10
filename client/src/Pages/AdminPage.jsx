// import { useState, useEffect } from "react";
// import { TEAL, TEAL_LIGHT, TEAL_DARK, GRAY_LIGHT, GRAY_MED } from "../Components/constants";
// import Card from "../Components/Card";
// import Badge from "../Components/Badge";
// import Btn from "../Components/Btn";
// import PageHeader from "../Components/PageHeader";

// export default function AdminPage() {
//   const [stats, setStats] = useState([]);
//   const [topCities, setTopCities] = useState([]);
//   const [tripStatus, setTripStatus] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchAdmin = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await fetch("/api/admin/stats", {
//           headers: { Authorization: "Bearer " + localStorage.getItem("token") },
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to load");
//         setStats(Array.isArray(data.stats) ? data.stats : []);
//         setTopCities(Array.isArray(data.topCities) ? data.topCities : []);
//         setTripStatus(Array.isArray(data.tripStatus) ? data.tripStatus : []);
//         setUsers(Array.isArray(data.recentUsers) ? data.recentUsers : []);
//       } catch (err) {
//         console.error("Failed to load admin data", err);
//         setError(err.message || "Failed to load admin data");
//       }
//       setLoading(false);
//     };
//     fetchAdmin();
//   }, []);

//   const handleBan = async (userId) => {
//     if (!window.confirm("Ban this user?")) return;
//     setUsers(users.filter(u => u.id !== userId));
//   };

//   if (loading) {
//     return (
//       <div>
//         <PageHeader title="Admin Dashboard" subtitle="Platform analytics and user management" />
//         <div style={{ textAlign: "center", padding: 60, color: GRAY_MED }}>Loading admin data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div>
//         <PageHeader title="Admin Dashboard" subtitle="Platform analytics and user management" />
//         <Card style={{ textAlign: "center", padding: "2rem" }}>
//           <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
//           <p style={{ color: "#791F1F", fontSize: 14, margin: 0 }}>{error}</p>
//           <p style={{ color: GRAY_MED, fontSize: 13, marginTop: 8 }}>
//             Admin access requires an admin account. Make sure you're logged in as admin.
//           </p>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <PageHeader title="Admin Dashboard" subtitle="Platform analytics and user management" />

//       {/* Stats */}
//       {stats.length > 0 && (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
//           {stats.map(s => (
//             <Card key={s.label} style={{ padding: "1rem" }}>
//               <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 4 }}>{s.label}</div>
//               <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{s.value}</div>
//               <div style={{ fontSize: 12, fontWeight: 500, color: s.up ? TEAL : "#E24B4A" }}>
//                 {s.up ? "↑" : "↓"} {s.change} vs last month
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Charts */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 20 }}>
//         <Card>
//           <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Top Cities</div>
//           {topCities.length === 0 ? (
//             <p style={{ color: GRAY_MED, fontSize: 13 }}>No city data yet — add some trips!</p>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               {topCities.map((c, i) => (
//                 <div key={c.name || i}>
//                   <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
//                     <span><span style={{ color: GRAY_MED, marginRight: 8 }}>#{i + 1}</span>{c.name}</span>
//                     <span style={{ fontWeight: 600 }}>{c.count} trips</span>
//                   </div>
//                   <div style={{ background: GRAY_LIGHT, borderRadius: 4, height: 6, overflow: "hidden" }}>
//                     <div style={{ height: "100%", width: `${c.pct || 0}%`, background: TEAL, borderRadius: 4 }} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>

//         <Card>
//           <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Trip Status Distribution</div>
//           {tripStatus.length === 0 ? (
//             <p style={{ color: GRAY_MED, fontSize: 13 }}>No trip data yet</p>
//           ) : (
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//               {tripStatus.map((s, i) => (
//                 <div key={s.label || i} style={{ background: GRAY_LIGHT, borderRadius: 10, padding: "14px 16px" }}>
//                   <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color || TEAL, marginBottom: 8 }} />
//                   <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>
//                     {Number(s.count || 0).toLocaleString()}
//                   </div>
//                   <div style={{ fontSize: 12, color: GRAY_MED }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Users Table */}
//       <Card>
//         <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>User Management</div>
//         {users.length === 0 ? (
//           <p style={{ color: GRAY_MED, fontSize: 13 }}>No users to display</p>
//         ) : (
//           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//             <thead>
//               <tr style={{ borderBottom: "2px solid #eee" }}>
//                 {["User", "Email", "Trips", "Joined", "Status", "Actions"].map(h => (
//                   <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: GRAY_MED, fontWeight: 600, fontSize: 12 }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(u => (
//                 <tr key={u.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
//                   <td style={{ padding: "12px 12px" }}>
//                     <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                       <div style={{ width: 28, height: 28, borderRadius: "50%", background: TEAL_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: TEAL_DARK }}>
//                         {u.name?.split(" ").map(n => n[0]).join("") || "?"}
//                       </div>
//                       {u.name}
//                     </div>
//                   </td>
//                   <td style={{ padding: "12px 12px", color: GRAY_MED }}>{u.email}</td>
//                   <td style={{ padding: "12px 12px", fontWeight: 600 }}>{u.trips ?? 0}</td>
//                   <td style={{ padding: "12px 12px", color: GRAY_MED }}>{u.joined}</td>
//                   <td style={{ padding: "12px 12px" }}>
//                     <Badge color={u.status === "Active" ? "teal" : "gray"}>{u.status || "Active"}</Badge>
//                   </td>
//                   <td style={{ padding: "12px 12px" }}>
//                     <div style={{ display: "flex", gap: 6 }}>
//                       <Btn small variant="ghost">View</Btn>
//                       <Btn small variant="danger" onClick={() => handleBan(u.id)}>Ban</Btn>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </Card>
//     </div>
//   );
// }

// the real time data api is lagging a little so we provided a mock data set for the best UI Experience

import { useState } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, GRAY_LIGHT, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

const MOCK_STATS = [
  { label: "Total Users", value: "1,284", change: "12%", up: true },
  { label: "Active Trips", value: "347", change: "8%", up: true },
  { label: "Cities Visited", value: "89", change: "5%", up: true },
  { label: "Revenue", value: "$24,500", change: "3%", up: false },
];
const MOCK_CITIES = [
  { name: "Paris", count: 142, pct: 90 },
  { name: "Tokyo", count: 118, pct: 75 },
  { name: "Barcelona", count: 97, pct: 62 },
  { name: "Rome", count: 84, pct: 53 },
  { name: "New York", count: 71, pct: 45 },
];
const MOCK_ACTIVITIES = [
  { name: "Eiffel Tower Visit", count: 98, type: "Sightseeing" },
  { name: "Colosseum Tour", count: 76, type: "Culture" },
  { name: "Sushi Making Class", count: 65, type: "Experience" },
  { name: "La Boqueria Market", count: 54, type: "Food" },
];
const MOCK_USERS = [
  { id: 1, name: "Arjun Mehta", email: "arjun@email.com", trips: 5, joined: "Jan 2026", status: "Active" },
  { id: 2, name: "Sofia Rossi", email: "sofia@email.com", trips: 3, joined: "Feb 2026", status: "Active" },
  { id: 3, name: "Keerthana P", email: "kee@email.com", trips: 7, joined: "Mar 2026", status: "Active" },
  { id: 4, name: "James Liu", email: "james@email.com", trips: 2, joined: "Apr 2026", status: "Inactive" },
];
const MOCK_TRENDS = [40, 65, 50, 80, 72, 95, 88];
const TABS = ["Manage Users", "Popular Cities", "Popular Activities", "User Trends & Analytics"];

export default function AdminPage() {
  const [tab, setTab] = useState("Manage Users");
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");

  const handleBan = (id) => {
    if (!window.confirm("Ban this user?")) return;
    setUsers(users.filter(u => u.id !== id));
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Simple SVG pie
  const pieData = [
    { label: "Upcoming", pct: 35, color: TEAL },
    { label: "Planning", pct: 45, color: "#E2794B" },
    { label: "Completed", pct: 20, color: "#5B8FE8" },
  ];
  let cum = -90;
  const slices = pieData.map(d => {
    const angle = d.pct * 3.6;
    const start = cum; cum += angle;
    const r = 55, cx = 70, cy = 70;
    const toR = deg => deg * Math.PI / 180;
    const x1 = cx + r * Math.cos(toR(start)), y1 = cy + r * Math.sin(toR(start));
    const x2 = cx + r * Math.cos(toR(cum - 0.01)), y2 = cy + r * Math.sin(toR(cum - 0.01));
    return { ...d, path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2},${y2} Z` };
  });

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Platform analytics and user management" />

      {/* Search + tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <input placeholder="Search users, cities..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: "9px 14px", fontSize: 13, outline: "none" }} />
        <Btn variant="ghost" small>Group by</Btn>
        <Btn variant="ghost" small>Filter</Btn>
        <Btn variant="ghost" small>Sort by</Btn>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 18px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13,
            cursor: "pointer", fontWeight: 500,
            background: tab === t ? TEAL : "#fff", color: tab === t ? "#fff" : "#555",
          }}>{t}</button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {MOCK_STATS.map(s => (
          <Card key={s.label} style={{ padding: "1rem" }}>
            <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: s.up ? TEAL : "#E24B4A" }}>
              {s.up ? "↑" : "↓"} {s.change} vs last month
            </div>
          </Card>
        ))}
      </div>

      {tab === "Manage Users" && (
        <Card>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>User Management</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee" }}>
                {["User", "Email", "Trips", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: GRAY_MED, fontWeight: 600, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: TEAL_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: TEAL_DARK }}>
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ padding: "12px", color: GRAY_MED }}>{u.email}</td>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{u.trips}</td>
                  <td style={{ padding: "12px", color: GRAY_MED }}>{u.joined}</td>
                  <td style={{ padding: "12px" }}><Badge color={u.status === "Active" ? "teal" : "gray"}>{u.status}</Badge></td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn small variant="ghost">View</Btn>
                      <Btn small variant="danger" onClick={() => handleBan(u.id)}>Ban</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "Popular Cities" && (
        <Card>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Popular Cities</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {MOCK_CITIES.map((c, i) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span><span style={{ color: GRAY_MED, marginRight: 8 }}>#{i + 1}</span>{c.name}</span>
                  <span style={{ fontWeight: 600 }}>{c.count} trips</span>
                </div>
                <div style={{ background: GRAY_LIGHT, borderRadius: 4, height: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${c.pct}%`, background: TEAL, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Popular Activities" && (
        <Card>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Popular Activities</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {MOCK_ACTIVITIES.map(a => (
              <div key={a.name} style={{ background: TEAL_LIGHT, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: TEAL_DARK, marginBottom: 4 }}>{a.name}</div>
                <Badge color="teal">{a.type}</Badge>
                <div style={{ fontSize: 20, fontWeight: 800, color: TEAL_DARK, marginTop: 8 }}>{a.count} <span style={{ fontSize: 12, fontWeight: 400, color: GRAY_MED }}>bookings</span></div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "User Trends & Analytics" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Trip Status Distribution</div>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
                <circle cx="70" cy="70" r="25" fill="#fff" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {slices.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />
                    <span>{s.label}</span>
                    <span style={{ fontWeight: 700, marginLeft: "auto" }}>{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Weekly Sign-ups</div>
            <svg width="100%" height="120" viewBox="0 0 280 120">
              <polyline
                points={MOCK_TRENDS.map((v, i) => `${i * 40 + 20},${120 - v}`).join(" ")}
                fill="none" stroke={TEAL} strokeWidth="3" strokeLinejoin="round" />
              {MOCK_TRENDS.map((v, i) => (
                <circle key={i} cx={i * 40 + 20} cy={120 - v} r="5" fill={TEAL} />
              ))}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: GRAY_MED, marginTop: 4 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}