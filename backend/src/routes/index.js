const express = require("express");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const usersRoutes = require("./users.routes");
const articlesRoutes = require("./articles.routes");
const blogsRoutes = require("./blogs.routes");
const platformsRoutes = require("./platforms.routes");
const publishingRoutes = require("./publishing.routes");
const analyticsRoutes = require("./analytics.routes");
const paymentsRoutes = require("./payments.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/users", usersRoutes);
router.use("/articles", articlesRoutes);
router.use("/blogs", blogsRoutes);
router.use("/platforms", platformsRoutes);
router.use("/publishing", publishingRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/payments", paymentsRoutes);

module.exports = router;
