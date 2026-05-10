const db = require("../config/db");

exports.getStats = async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ message: "Admins only" });
  try {
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) as totalUsers FROM users");
    const [[{ totalTrips }]] = await db.query("SELECT COUNT(*) as totalTrips FROM trips");
    const [[{ activeToday }]] = await db.query(
      "SELECT COUNT(*) as activeToday FROM trips WHERE DATE(created_at) = CURDATE()"
    );

    const [topCitiesRaw] = await db.query(
      "SELECT city_name as name, COUNT(*) as count FROM stops GROUP BY city_name ORDER BY count DESC LIMIT 5"
    );
    const maxCount = topCitiesRaw[0]?.count || 1;
    const topCities = topCitiesRaw.map(c => ({ ...c, pct: Math.round((c.count / maxCount) * 100) }));

    const [tripStatusRaw] = await db.query(
      "SELECT status as label, COUNT(*) as count FROM trips GROUP BY status"
    );
    const statusColors = { Planning: "#EF9F27", Upcoming: "#1D9E75", Ongoing: "#185FA5", Completed: "#888780" };
    const tripStatus = tripStatusRaw.map(s => ({ ...s, color: statusColors[s.label] || "#888" }));

    const [users] = await db.query(
      `SELECT u.id, u.name, u.email, u.created_at,
        COUNT(t.id) as trips,
        DATE_FORMAT(u.created_at, '%b %Y') as joined,
        'Active' as status
       FROM users u LEFT JOIN trips t ON t.user_id = u.id
       GROUP BY u.id ORDER BY u.created_at DESC LIMIT 10`
    );

    res.json({
      stats: [
        { label: "Total Users",     value: totalUsers.toLocaleString(), change: "+12%", up: true },
        { label: "Trips Created",   value: totalTrips.toLocaleString(), change: "+8%",  up: true },
        { label: "Active Today",    value: activeToday.toLocaleString(), change: "",    up: true },
        { label: "Avg Trip Length", value: "12d", change: "+1d", up: true },
      ],
      topCities,
      tripStatus,
      recentUsers: users,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};