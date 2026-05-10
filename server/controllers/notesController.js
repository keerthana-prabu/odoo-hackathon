const db = require("../config/db");

exports.getNotes = async (req, res) => {
  try {
    const [notes] = await db.query(
      "SELECT * FROM notes WHERE trip_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );
    const formatted = notes.map(n => ({
      ...n,
      date: new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addNote = async (req, res) => {
  const { title, content, stop } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  try {
    const [result] = await db.query(
      "INSERT INTO notes (trip_id, title, content, stop) VALUES (?, ?, ?, ?)",
      [req.params.id, title, content || "", stop || ""]
    );
    const [rows] = await db.query("SELECT * FROM notes WHERE id = ?", [result.insertId]);
    res.status(201).json({ ...rows[0], date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await db.query("DELETE FROM notes WHERE id = ? AND trip_id = ?", [req.params.noteId, req.params.id]);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};