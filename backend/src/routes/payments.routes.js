const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/payments.controller");

const router = express.Router();

router.post("/create-order", requireAuth, controller.createPaymentOrder);
router.post("/verify", requireAuth, controller.verifyPayment);
router.post("/webhook", express.json({ verify: (req, _res, buf) => { req.rawBody = buf.toString(); } }), controller.webhook);

module.exports = router;
