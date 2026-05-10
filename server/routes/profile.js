const router = require("express").Router();
const auth = require("../middleware/auth");
const db = require("../config/db");

router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, bio, lang FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json({ ...rows[0], savedDestinations: [] });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/", auth, async (req, res) => {
  const { name, email, bio, lang } = req.body;
  try {
    await db.query("UPDATE users SET name=?, email=?, bio=?, lang=? WHERE id=?", [name, email, bio, lang, req.user.id]);
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;