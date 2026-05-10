const db = require("../config/db");

exports.getPacking = async (req, res) => {
  try {
    const [items] = await db.query(
      "SELECT * FROM packing_items WHERE trip_id = ? ORDER BY category, name",
      [req.params.id]
    );
    const categories = {};
    const checked = {};
    for (const item of items) {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item.name);
      if (item.is_checked) checked[item.category + item.name] = true;
    }
    res.json({ categories, checked });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addItem = async (req, res) => {
  const { name, category } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO packing_items (trip_id, name, category) VALUES (?, ?, ?)",
      [req.params.id, name, category || "Misc"]
    );
    const [rows] = await db.query("SELECT * FROM packing_items WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateChecked = async (req, res) => {
  const { name, category, is_checked } = req.body;
  try {
    await db.query(
      "UPDATE packing_items SET is_checked = ? WHERE trip_id = ? AND name = ? AND category = ?",
      [is_checked, req.params.id, name, category]
    );
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await db.query("DELETE FROM packing_items WHERE id = ? AND trip_id = ?", [req.params.itemId, req.params.id]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};