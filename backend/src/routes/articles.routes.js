const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/articles.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.listArticles);
router.post("/", controller.createArticle);
router.post("/fix-status", controller.fixStatus);
router.get("/:id", controller.getArticle);
router.put("/:id", controller.updateArticle);
router.get("/:id/publishes", controller.listArticlePublishes);
router.post("/:id/publish-publishtype", controller.publishToPublishType);
router.post("/:id/publish-blogai", controller.publishToBlogAi);
router.get("/:id/export", controller.exportArticle);

module.exports = router;
