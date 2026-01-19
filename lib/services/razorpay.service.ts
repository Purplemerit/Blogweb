import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Plan pricing in INR (paise - smallest currency unit)
// IMPORTANT: Razorpay uses PAISE (100 paise = 1 rupee)
// To charge ₹5000, use 500000 paise
export const PLAN_PRICING = {
  STARTER: {
    monthly: 500000,   // ₹5,000 (500000 paise = $60.24)
    annual: 4000000,   // ₹40,000 (4000000 paise = $481.93)
  },
  CREATOR: {
    monthly: 1500000,  // ₹15,000 (1500000 paise = $180.72)
    annual: 15000000,  // ₹1,50,000 (15000000 paise = $1,807.23)
  },
  PROFESSIONAL: {
    monthly: 2000000,  // ₹20,000 (2000000 paise = $240.96)
    annual: 18000000,  // ₹1,80,000 (18000000 paise = $2,168.67)
  },
} as const;

export type PlanType = keyof typeof PLAN_PRICING;
export type BillingPeriod = 'monthly' | 'annual';

interface CreateOrderParams {
  plan: PlanType;
  billingPeriod: BillingPeriod;
  userId: string;
  userEmail: string;
  userName: string;
}

interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  plan: PlanType;
  billingPeriod: BillingPeriod;
  keyId: string;
  prefill: {
    name: string;
    email: string;
  };
}

export async function createOrder(params: CreateOrderParams): Promise<OrderResponse> {
  const { plan, billingPeriod, userId, userEmail, userName } = params;

  const amount = PLAN_PRICING[plan][billingPeriod];

  // Generate a short receipt ID (max 40 chars)
  const shortUserId = userId.substring(0, 8);
  const timestamp = Date.now().toString(36); // Base36 for shorter string

  const options = {
    amount: amount,
    currency: 'INR',
    receipt: `rcpt_${shortUserId}_${timestamp}`,
    notes: {
      userId,
      plan,
      billingPeriod,
    },
  };

  const order = await razorpay.orders.create(options);

  return {
    orderId: order.id,
    amount: order.amount as number,
    currency: order.currency,
    plan,
    billingPeriod,
    keyId: process.env.RAZORPAY_KEY_ID!,
    prefill: {
      name: userName,
      email: userEmail,
    },
  };
}

interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function verifyPayment(params: VerifyPaymentParams): boolean {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpay_signature;
}

export async function fetchPaymentDetails(paymentId: string) {
  return await razorpay.payments.fetch(paymentId);
}

export async function fetchOrderDetails(orderId: string) {
  return await razorpay.orders.fetch(orderId);
}

// Create subscription (for recurring payments)
interface CreateSubscriptionParams {
  plan: PlanType;
  billingPeriod: BillingPeriod;
  userId: string;
  userEmail: string;
}

export async function createSubscription(params: CreateSubscriptionParams) {
  // Note: For subscriptions, you need to create plans in Razorpay dashboard first
  // This is for one-time payments. For recurring, use Razorpay Subscriptions API
  // which requires plan_id from Razorpay dashboard

  // For now, we'll use one-time payments that can be renewed manually
  // or implement subscription logic separately

  return null;
}

export { razorpay };
