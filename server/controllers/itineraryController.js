const db = require("../config/db");

exports.getItinerary = async (req, res) => {
  try {
    const [stops] = await db.query(
      "SELECT * FROM stops WHERE trip_id = ? ORDER BY position ASC",
      [req.params.id]
    );
    const days = [];
    for (const stop of stops) {
      const [activities] = await db.query(
        "SELECT * FROM activities WHERE stop_id = ? ORDER BY time ASC",
        [stop.id]
      );
      if (stop.arrival_date) {
        days.push({
          date: new Date(stop.arrival_date).toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" }),
          city: stop.city_name,
          activities,
        });
      }
    }
    res.json({ days });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getStops = async (req, res) => {
  try {
    const [stops] = await db.query(
      "SELECT * FROM stops WHERE trip_id = ? ORDER BY position ASC",
      [req.params.id]
    );
    for (const stop of stops) {
      const [activities] = await db.query(
        "SELECT * FROM activities WHERE stop_id = ?",
        [stop.id]
      );
      stop.activities = activities;
    }
    res.json(stops);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addStop = async (req, res) => {
  const { city_name, full_name, emoji, arrival_date, departure_date, position } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO stops (trip_id, city_name, full_name, emoji, arrival_date, departure_date, position) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [req.params.id, city_name, full_name || city_name, emoji || "🌍", arrival_date || null, departure_date || null, position || 0]
    );
    const [rows] = await db.query("SELECT * FROM stops WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateStop = async (req, res) => {
  const { arrival_date, departure_date, position } = req.body;
  try {
    await db.query(
      "UPDATE stops SET arrival_date=?, departure_date=?, position=? WHERE id=? AND trip_id=?",
      [arrival_date, departure_date, position, req.params.stopId, req.params.id]
    );
    res.json({ message: "Stop updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteStop = async (req, res) => {
  try {
    await db.query("DELETE FROM stops WHERE id = ? AND trip_id = ?", [req.params.stopId, req.params.id]);
    res.json({ message: "Stop deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addActivity = async (req, res) => {
  const { name, type, cost, duration, time, emoji } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO activities (stop_id, name, type, cost, duration, time, emoji) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [req.params.stopId, name, type || "Experience", cost || 0, duration || "", time || "", emoji || "🎯"]
    );
    const [rows] = await db.query("SELECT * FROM activities WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    await db.query("DELETE FROM activities WHERE id = ?", [req.params.activityId]);
    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};