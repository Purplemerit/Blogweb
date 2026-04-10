const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/publishing.controller");

const router = express.Router();

router.post("/process-queue", controller.processQueue);
router.get("/process-queue", controller.processQueue);
router.post("/retry-failed", requireAuth, controller.retryFailed);

module.exports = router;
