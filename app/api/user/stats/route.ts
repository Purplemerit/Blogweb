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

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Run ALL queries in parallel for maximum performance
    const [articlesCreatedThisMonth, articleStats, totalViews] = await Promise.all([
      // Count articles created this month
      prisma.article.count({
        where: {
          userId: currentUser.id,
          createdAt: {
            gte: startOfMonth,
          },
          deletedAt: null,
        },
      }),
      // Single query to get all article counts by status using groupBy
      prisma.article.groupBy({
        by: ['status'],
        where: {
          userId: currentUser.id,
          deletedAt: null,
        },
        _count: true,
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

    // Process the grouped results
    let totalArticles = 0;
    let publishedCount = 0;
    let draftCount = 0;
    let scheduledCount = 0;

    articleStats.forEach((stat) => {
      totalArticles += stat._count;
      if (stat.status === 'PUBLISHED') publishedCount = stat._count;
      else if (stat.status === 'DRAFT') draftCount = stat._count;
      else if (stat.status === 'SCHEDULED') scheduledCount = stat._count;
    });

    // Combine database stats with real-time counts
    const stats = {
      articlesCreatedThisMonth,
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
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
        },
      }
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
