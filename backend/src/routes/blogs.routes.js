const express = require("express");
const controller = require("../controllers/blogs.controller");

const router = express.Router();

router.get("/public", controller.listPublicBlogs);
router.get("/public/:id", controller.getPublicBlogById);

module.exports = router;
