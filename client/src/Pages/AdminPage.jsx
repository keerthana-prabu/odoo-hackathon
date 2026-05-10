import { useState, useEffect } from "react";
import { TEAL, TEAL_LIGHT, TEAL_DARK, AMBER, GRAY_LIGHT, GRAY_MED } from "../Components/constants";
import Card from "../Components/Card";
import Badge from "../Components/Badge";
import Btn from "../Components/Btn";
import PageHeader from "../Components/PageHeader";

export default function AdminPage() {
  const [stats, setStats] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [tripStatus, setTripStatus] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
       const res = await fetch("/api/admin/stats", {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") },
});
const data = await res.json();
setStats(data.stats);
setTopCities(data.topCities);
setTripStatus(data.tripStatus);
setUsers(data.recentUsers);
      } catch (err) {
        console.error("Failed to load admin data", err);
      }
      setLoading(false);
    };
    fetchAdmin();
  }, []);

  const handleBan = async (userId) => {
    if (!window.confirm("Ban this user?")) return;
    // TODO: POST /api/admin/users/:id/ban
    setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Platform analytics and user management" />

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: GRAY_MED }}>Loading admin data...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {stats.map(s => (
              <Card key={s.label} style={{ padding: "1rem" }}>
                <div style={{ fontSize: 12, color: GRAY_MED, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: s.up ? TEAL : "#E24B4A" }}>
                  {s.up ? "↑" : "↓"} {s.change} vs last month
                </div>
              </Card>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 20 }}>
            <Card>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Top Cities</div>
              {topCities.length === 0 ? (
                <p style={{ color: GRAY_MED, fontSize: 13 }}>No data yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {topCities.map((c, i) => (
                    <div key={c.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                        <span><span style={{ color: GRAY_MED, marginRight: 8 }}>#{i + 1}</span>{c.name}</span>
                        <span style={{ fontWeight: 600 }}>{c.count} trips</span>
                      </div>
                      <div style={{ background: GRAY_LIGHT, borderRadius: 4, height: 6, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${c.pct}%`, background: TEAL, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Trip Status Distribution</div>
              {tripStatus.length === 0 ? (
                <p style={{ color: GRAY_MED, fontSize: 13 }}>No data yet</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {tripStatus.map(s => (
                    <div key={s.label} style={{ background: GRAY_LIGHT, borderRadius: 10, padding: "14px 16px" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, marginBottom: 8 }} />
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>{s.count.toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: GRAY_MED }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>User Management</div>
            {users.length === 0 ? (
              <p style={{ color: GRAY_MED, fontSize: 13 }}>No users to display</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    {["User", "Email", "Trips", "Joined", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: GRAY_MED, fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "12px 12px" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: TEAL_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: TEAL_DARK }}>
                            {u.name?.split(" ").map(n => n[0]).join("") || "?"}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", color: GRAY_MED }}>{u.email}</td>
                      <td style={{ padding: "12px 12px", fontWeight: 600 }}>{u.trips}</td>
                      <td style={{ padding: "12px 12px", color: GRAY_MED }}>{u.joined}</td>
                      <td style={{ padding: "12px 12px" }}>
                        <Badge color={u.status === "Active" ? "teal" : "gray"}>{u.status}</Badge>
                      </td>
                      <td style={{ padding: "12px 12px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Btn small variant="ghost">View</Btn>
                          <Btn small variant="danger" onClick={() => handleBan(u.id)}>Ban</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </div>
  );
}