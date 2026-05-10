const db = require("../config/db");

exports.getAllTrips = async (req, res) => {
  try {
    const [trips] = await db.query(
      `SELECT t.*, 
        DATE_FORMAT(t.start_date, '%b %d') as start_fmt,
        DATE_FORMAT(t.end_date, '%b %d, %Y') as end_fmt,
        COUNT(DISTINCT s.id) as cities
       FROM trips t
       LEFT JOIN stops s ON s.trip_id = t.id
       WHERE t.user_id = ?
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    const formatted = trips.map(t => ({
      ...t,
      dates: `${t.start_fmt} – ${t.end_fmt}`,
      budget: parseFloat(t.budget),
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getTrip = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM trips WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Trip not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createTrip = async (req, res) => {
  const { name, start_date, end_date, description, cover, budget, status } = req.body;
  if (!name) return res.status(400).json({ message: "Trip name is required" });
  try {
    const [result] = await db.query(
      "INSERT INTO trips (user_id, name, start_date, end_date, description, cover, budget, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [req.user.id, name, start_date || null, end_date || null, description || "", cover || "🌍", budget || 0, status || "Planning"]
    );
    const [rows] = await db.query("SELECT * FROM trips WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateTrip = async (req, res) => {
  const { name, start_date, end_date, description, cover, budget, status } = req.body;
  try {
    await db.query(
      "UPDATE trips SET name=?, start_date=?, end_date=?, description=?, cover=?, budget=?, status=? WHERE id=? AND user_id=?",
      [name, start_date, end_date, description, cover, budget, status, req.params.id, req.user.id]
    );
    res.json({ message: "Trip updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    await db.query("DELETE FROM trips WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const [[{ totalTrips }]] = await db.query("SELECT COUNT(*) as totalTrips FROM trips WHERE user_id = ?", [userId]);
    const [[{ countries }]] = await db.query(
      "SELECT COUNT(DISTINCT SUBSTRING_INDEX(s.full_name, ',', -1)) as countries FROM stops s JOIN trips t ON t.id = s.trip_id WHERE t.user_id = ?",
      [userId]
    );
    const [[{ citiesVisited }]] = await db.query(
      "SELECT COUNT(DISTINCT s.city_name) as citiesVisited FROM stops s JOIN trips t ON t.id = s.trip_id WHERE t.user_id = ?",
      [userId]
    );
    const [recentTrips] = await db.query(
      `SELECT t.*, COUNT(DISTINCT s.id) as cities,
        DATE_FORMAT(t.start_date, '%b %d') as start_fmt,
        DATE_FORMAT(t.end_date, '%b %d, %Y') as end_fmt
       FROM trips t LEFT JOIN stops s ON s.trip_id = t.id
       WHERE t.user_id = ? GROUP BY t.id ORDER BY t.created_at DESC LIMIT 3`,
      [userId]
    );
    const formatted = recentTrips.map(t => ({ ...t, dates: `${t.start_fmt} – ${t.end_fmt}` }));
    res.json({
      stats: { totalTrips, citiesVisited, countries, budgetSaved: 0 },
      recentTrips: formatted,
      recommended: [], // TODO: wire to a recommendations API
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};