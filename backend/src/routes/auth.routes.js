const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/me", requireAuth, controller.me);
router.post("/verify-email", controller.verifyEmail);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);
router.post("/refresh", controller.refresh);

module.exports = router;
