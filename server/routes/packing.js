const router = require("express").Router({ mergeParams: true });
const auth = require("../middleware/auth");
const { getPacking, addItem, updateChecked, deleteItem } = require("../controllers/packingController");
router.get("/", auth, getPacking);
router.post("/", auth, addItem);
router.patch("/checked", auth, updateChecked);
router.delete("/:itemId", auth, deleteItem);
module.exports = router;