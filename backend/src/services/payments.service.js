const crypto = require("crypto");
const Razorpay = require("razorpay");
const { env } = require("../config/env");

const PLAN_PRICING = {
  STARTER: { monthly: 500000, annual: 4000000 },
  CREATOR: { monthly: 1500000, annual: 15000000 },
  PROFESSIONAL: { monthly: 2000000, annual: 18000000 },
};

const razorpay = env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
  : null;

async function createOrder({ plan, billingPeriod, userId, userEmail, userName }) {
  const amount = PLAN_PRICING[plan][billingPeriod];
  const shortUserId = userId.substring(0, 8);
  const timestamp = Date.now().toString(36);

  if (!razorpay) {
    return {
      orderId: `mock_order_${timestamp}`,
      amount,
      currency: "INR",
      plan,
      billingPeriod,
      keyId: "mock_key",
      prefill: { name: userName, email: userEmail },
      isMock: true,
    };
  }

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `rcpt_${shortUserId}_${timestamp}`,
    notes: {
      userId,
      plan,
      billingPeriod,
    },
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    plan,
    billingPeriod,
    keyId: env.RAZORPAY_KEY_ID,
    prefill: { name: userName, email: userEmail },
  };
}

function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET || "").update(body).digest("hex");
  return expected === razorpay_signature;
}

function verifyWebhookSignature(body, signature) {
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET || "")
    .update(body)
    .digest("hex");

  return expected === signature;
}

module.exports = {
  PLAN_PRICING,
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
};
