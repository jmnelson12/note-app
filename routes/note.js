const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");

router.route("/create").post(noteController.create);
router.route("/get/:id").get(noteController.get);
router.route("/getAll").get(noteController.getAll);
router.route("/edit/:id").put(noteController.edit);
router.route("/delete/:id").delete(noteController.deleteNote);

module.exports = router;
