import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { getModelsForPlan, getDefaultModel } from '@/lib/ai/models';

/**
 * GET /api/ai/models
 * Returns all AI models with lock status based on user's subscription
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No access token provided' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    // Get all models with lock status
    const models = getModelsForPlan(currentUser.subscriptionPlan);
    const defaultModel = getDefaultModel(currentUser.subscriptionPlan);

    return NextResponse.json({
      success: true,
      data: {
        models,
        defaultModel: defaultModel.id,
        currentPlan: currentUser.subscriptionPlan,
        upgradeUrl: '/dashboard/settings/billing',
      },
    });
  } catch (error: any) {
    console.error('Get AI models error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch AI models',
      },
      { status: 500 }
    );
  }
}
