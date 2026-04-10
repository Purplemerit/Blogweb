import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { createOrder, PlanType, BillingPeriod } from '@/lib/services/razorpay.service';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    // Get plan details from request body
    const body = await request.json();
    const { plan, billingPeriod } = body as {
      plan: PlanType;
      billingPeriod: BillingPeriod;
    };

    // Validate plan
    if (!['STARTER', 'CREATOR', 'PROFESSIONAL'].includes(plan)) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Validate billing period
    if (!['monthly', 'annual'].includes(billingPeriod)) {
      return NextResponse.json(
        { success: false, error: 'Invalid billing period' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const orderData = await createOrder({
      plan,
      billingPeriod,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
    });

    return NextResponse.json({
      success: true,
      data: orderData,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
