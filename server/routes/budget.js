const router = require("express").Router({ mergeParams: true });
const auth = require("../middleware/auth");
const { getBudget, addExpense, deleteExpense } = require("../controllers/budgetController");
router.get("/", auth, getBudget);
router.post("/expenses", auth, addExpense);
router.delete("/expenses/:expenseId", auth, deleteExpense);
module.exports = router;