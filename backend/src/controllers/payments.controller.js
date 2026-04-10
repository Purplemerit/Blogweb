const { prisma } = require("../db/prisma");
const { sendError, sendSuccess } = require("../utils/http");
const {
  PLAN_PRICING,
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
} = require("../services/payments.service");

const VALID_PLANS = ["STARTER", "CREATOR", "PROFESSIONAL"];
const VALID_PERIODS = ["monthly", "annual"];

function getSubscriptionEndDate(billingPeriod) {
  const endDate = new Date();
  if (billingPeriod === "annual") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  return endDate;
}

async function createPaymentOrder(req, res) {
  try {
    const { plan, billingPeriod } = req.body;

    if (!VALID_PLANS.includes(plan)) {
      return sendError(res, "Invalid plan. Must be STARTER, CREATOR, or PROFESSIONAL", 400);
    }

    if (!VALID_PERIODS.includes(billingPeriod)) {
      return sendError(res, "Invalid billing period. Must be monthly or annual", 400);
    }

    const orderData = await createOrder({
      plan,
      billingPeriod,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
    });

    return sendSuccess(res, { data: { orderData, pricing: PLAN_PRICING } });
  } catch (error) {
    return sendError(res, error.message || "Failed to create payment order");
  }
}

async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, billingPeriod } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return sendError(res, "Missing required payment fields", 400);
    }

    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return sendError(res, "Invalid payment signature", 400);
    }

    const startDate = new Date();
    const endDate = getSubscriptionEndDate(billingPeriod || "monthly");

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        subscriptionPlan: plan || "STARTER",
        subscriptionStatus: "ACTIVE",
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      },
      select: {
        id: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: "subscription_payment_verified",
        metadata: {
          razorpay_order_id,
          razorpay_payment_id,
          plan: plan || "STARTER",
          billingPeriod: billingPeriod || "monthly",
        },
      },
    });

    return sendSuccess(res, {
      data: {
        subscription: {
          id: user.id,
          plan: user.subscriptionPlan,
          status: user.subscriptionStatus,
          startDate: user.subscriptionStartDate,
          endDate: user.subscriptionEndDate,
        },
      },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to verify payment");
  }
}

async function webhook(req, res) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    if (!signature) return sendError(res, "Missing webhook signature", 400);

    const rawBody = req.rawBody || JSON.stringify(req.body);
    const valid = verifyWebhookSignature(rawBody, signature);
    if (!valid) return sendError(res, "Invalid webhook signature", 400);

    const event = req.body.event;
    const payload = req.body.payload || {};

    if (event === "payment.captured") {
      const notes = payload.payment?.entity?.notes || {};
      if (notes.userId) {
        const startDate = new Date();
        const endDate = getSubscriptionEndDate(notes.billingPeriod || "monthly");

        await prisma.user.update({
          where: { id: notes.userId },
          data: {
            subscriptionPlan: notes.plan || "STARTER",
            subscriptionStatus: "ACTIVE",
            subscriptionStartDate: startDate,
            subscriptionEndDate: endDate,
          },
        });
      }
    }

    if (event === "payment.failed") {
      const notes = payload.payment?.entity?.notes || {};
      if (notes.userId) {
        await prisma.user.update({
          where: { id: notes.userId },
          data: { subscriptionStatus: "CANCELLED" },
        });
      }
    }

    const notes = payload.payment?.entity?.notes || {};
    if (notes.userId) {
      await prisma.activityLog.create({
        data: {
          userId: notes.userId,
          action: `payment_webhook_${event}`,
          metadata: req.body,
        },
      });
    }

    return sendSuccess(res, {}, 200, "Webhook processed");
  } catch (error) {
    return sendError(res, error.message || "Failed to handle webhook");
  }
}

module.exports = {
  createPaymentOrder,
  verifyPayment,
  webhook,
};
