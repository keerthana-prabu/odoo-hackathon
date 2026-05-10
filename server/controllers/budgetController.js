const db = require("../config/db");

exports.getBudget = async (req, res) => {
  try {
    const tripId = req.params.id;
    const [[trip]] = await db.query("SELECT budget, start_date, end_date FROM trips WHERE id = ? AND user_id = ?", [tripId, req.user.id]);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const [expenses] = await db.query("SELECT * FROM expenses WHERE trip_id = ?", [tripId]);
    const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const days = trip.start_date && trip.end_date
      ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24))
      : 1;

    // Group by category
    const categoryMap = {};
    for (const e of expenses) {
      if (!categoryMap[e.category]) categoryMap[e.category] = { label: e.category, amount: 0, icon: e.icon, color: "#1D9E75" };
      categoryMap[e.category].amount += parseFloat(e.amount);
    }
    const breakdown = Object.values(categoryMap);

    // Group by city via stops + activities cost
    const [stopCosts] = await db.query(
      `SELECT s.city_name, s.emoji,
        DATEDIFF(s.departure_date, s.arrival_date) as days,
        COALESCE(SUM(a.cost), 0) as cost
       FROM stops s
       LEFT JOIN activities a ON a.stop_id = s.id
       WHERE s.trip_id = ?
       GROUP BY s.id`,
      [tripId]
    );

    res.json({
      budget: parseFloat(trip.budget),
      spent: totalSpent,
      days,
      breakdown,
      byCity: stopCosts.map(s => ({
        city: s.city_name,
        emoji: s.emoji,
        days: s.days || 1,
        cost: parseFloat(s.cost),
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addExpense = async (req, res) => {
  const { label, amount, icon, category } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO expenses (trip_id, label, amount, icon, category) VALUES (?, ?, ?, ?, ?)",
      [req.params.id, label, amount, icon || "💰", category || "Misc"]
    );
    const [rows] = await db.query("SELECT * FROM expenses WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await db.query("DELETE FROM expenses WHERE id = ? AND trip_id = ?", [req.params.expenseId, req.params.id]);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};