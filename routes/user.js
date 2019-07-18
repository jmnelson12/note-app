const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/logout").get(userController.logout);
router.route("/verify").get(userController.verify);
router.route("/delete").get(userController.delete);

module.exports = router;
