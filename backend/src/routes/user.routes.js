const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/user.controller");

const router = express.Router();

router.use(requireAuth);
router.put("/profile", controller.updateProfile);
router.put("/password", controller.changePassword);
router.get("/settings", controller.getSettings);
router.put("/settings", controller.updateSettings);
router.get("/stats", controller.getUserStats);
router.get("/subscription-usage", controller.getSubscriptionUsage);
router.delete("/account", controller.deleteAccount);

module.exports = router;
