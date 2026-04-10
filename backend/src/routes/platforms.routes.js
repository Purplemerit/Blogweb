const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/platforms.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/connections", controller.listConnections);
router.delete("/connections/:id", controller.removeConnection);

router.post("/:platform/connect", controller.connectPlatform);
router.post("/:platform/publish", controller.publishToPlatform);

router.post("/publish-multiple", controller.publishMultiple);
router.post("/bulk-publish", controller.publishMultiple);
router.post("/update-post", controller.updatePost);

module.exports = router;
