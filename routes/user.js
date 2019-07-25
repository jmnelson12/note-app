const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/verify").get(userController.verify);
router.get("/logout", authMiddleware, userController.logout);
router.delete("/deleteUser", authMiddleware, userController.deleteUser);

module.exports = router;
