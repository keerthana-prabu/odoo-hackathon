const router = require("express").Router({ mergeParams: true });
const auth = require("../middleware/auth");
const { getNotes, addNote, deleteNote } = require("../controllers/notesController");
router.get("/", auth, getNotes);
router.post("/", auth, addNote);
router.delete("/:noteId", auth, deleteNote);
module.exports = router;