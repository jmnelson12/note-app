const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");

router.route("/create").post(noteController.create);
router.route("/get/:id").get(noteController.get);
router.route("/edit/:id").put(noteController.edit);
router.route("/delete/:id").delete(noteController.delete);

module.exports = router;
