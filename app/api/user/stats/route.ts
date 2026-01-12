import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'No access token provided',
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);
    const currentUser = await authService.getCurrentUser(accessToken);

    // Get or create usage stats from database
    let usageStats = await prisma.usageStats.findUnique({
      where: { userId: currentUser.id },
    });

    if (!usageStats) {
      // Create default stats
      usageStats = await prisma.usageStats.create({
        data: { userId: currentUser.id },
      });
    }

    // Calculate real-time article counts by status
    const [totalArticles, publishedCount, draftCount, scheduledCount, totalViews] = await Promise.all([
      // Total articles (excluding deleted)
      prisma.article.count({
        where: {
          userId: currentUser.id,
          deletedAt: null,
        },
      }),
      // Published articles
      prisma.article.count({
        where: {
          userId: currentUser.id,
          status: 'PUBLISHED',
          deletedAt: null,
        },
      }),
      // Draft articles
      prisma.article.count({
        where: {
          userId: currentUser.id,
          status: 'DRAFT',
          deletedAt: null,
        },
      }),
      // Scheduled articles
      prisma.article.count({
        where: {
          userId: currentUser.id,
          status: 'SCHEDULED',
          deletedAt: null,
        },
      }),
      // Total views across all articles
      prisma.article.aggregate({
        where: {
          userId: currentUser.id,
          deletedAt: null,
        },
        _sum: {
          views: true,
        },
      }),
    ]);

    // Combine database stats with real-time counts
    const stats = {
      ...usageStats,
      totalArticles,
      totalPublished: publishedCount,
      totalDrafts: draftCount,
      totalScheduled: scheduledCount,
      totalViews: totalViews._sum.views || 0,
    };

    return NextResponse.json(
      {
        success: true,
        data: stats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get stats',
      },
      { status: 500 }
    );
  }
}
