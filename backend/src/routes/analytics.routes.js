const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/analytics.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getAnalytics);
router.get("/stats", controller.getAnalyticsStats);
router.post("/sync", controller.syncAnalytics);

module.exports = router;
