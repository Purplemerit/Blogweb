import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
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

    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    const platform = searchParams.get('platform');

    // Build where clause
    const where: any = {
      publishRecord: {
        platformConnection: {
          userId: currentUser.id,
        },
      },
    };

    if (articleId) {
      where.publishRecord.articleId = articleId;
    }

    if (platform) {
      where.publishRecord.platform = platform;
    }

    // Fetch analytics with related data
    const analytics = await prisma.platformAnalytics.findMany({
      where,
      include: {
        publishRecord: {
          include: {
            article: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
            platformConnection: {
              select: {
                platform: true,
                metadata: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastSyncAt: 'desc',
      },
    });

    // Calculate totals
    const totals = {
      views: 0,
      uniqueVisitors: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarks: 0,
    };

    analytics.forEach((a) => {
      totals.views += a.views;
      totals.uniqueVisitors += a.uniqueVisitors;
      totals.likes += a.likes;
      totals.comments += a.comments;
      totals.shares += a.shares;
      totals.bookmarks += a.bookmarks;
    });

    // Group by platform
    const byPlatform: Record<string, any> = {};
    analytics.forEach((a) => {
      const platform = a.publishRecord.platform;
      if (!byPlatform[platform]) {
        byPlatform[platform] = {
          platform,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          articles: 0,
        };
      }
      byPlatform[platform].totalViews += a.views;
      byPlatform[platform].totalLikes += a.likes;
      byPlatform[platform].totalComments += a.comments;
      byPlatform[platform].articles += 1;
    });

    // Group by article
    const byArticle: Record<string, any> = {};
    analytics.forEach((a) => {
      const articleId = a.publishRecord.articleId;
      if (!byArticle[articleId]) {
        byArticle[articleId] = {
          articleId,
          articleTitle: a.publishRecord.article.title,
          articleSlug: a.publishRecord.article.slug,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          platforms: [],
        };
      }
      byArticle[articleId].totalViews += a.views;
      byArticle[articleId].totalLikes += a.likes;
      byArticle[articleId].totalComments += a.comments;
      byArticle[articleId].platforms.push({
        platform: a.publishRecord.platform,
        views: a.views,
        likes: a.likes,
        comments: a.comments,
        url: a.publishRecord.url,
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        totals,
        byPlatform: Object.values(byPlatform),
        byArticle: Object.values(byArticle),
        lastSync: analytics[0]?.lastSyncAt || null,
      },
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch analytics',
      },
      { status: 500 }
    );
  }
}
