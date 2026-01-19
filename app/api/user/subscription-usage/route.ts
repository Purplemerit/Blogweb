import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { getPlanLimits } from '@/lib/subscription/features';
import prisma from '@/lib/prisma';

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

    // Get plan limits
    const limits = getPlanLimits(currentUser.subscriptionPlan);

    // Get current month start
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get usage
    const [articlesThisMonth, drafts, platformConnections] = await Promise.all([
      prisma.article.count({
        where: {
          userId: currentUser.id,
          createdAt: { gte: currentMonth },
          deletedAt: null,
        },
      }),
      prisma.article.count({
        where: {
          userId: currentUser.id,
          status: 'DRAFT',
          deletedAt: null,
        },
      }),
      prisma.platformConnection.count({
        where: {
          userId: currentUser.id,
          status: 'CONNECTED',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        plan: currentUser.subscriptionPlan,
        articlesThisMonth,
        maxArticlesPerMonth: limits.maxArticlesPerMonth,
        drafts,
        maxDrafts: limits.maxDrafts,
        platformConnections,
        maxPlatformConnections: limits.maxPlatformConnections,
        isOverLimit: limits.maxArticlesPerMonth !== -1 && articlesThisMonth >= limits.maxArticlesPerMonth,
      },
    });
  } catch (error: any) {
    console.error('Get subscription usage error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch subscription usage',
      },
      { status: 500 }
    );
  }
}
