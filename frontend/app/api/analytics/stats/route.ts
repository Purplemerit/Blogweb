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

    // Get article statistics
    const [
      totalArticles,
      draftArticles,
      publishedArticles,
      scheduledArticles,
      archivedArticles,
      totalWords,
      totalViews,
    ] = await Promise.all([
      // Total articles
      prisma.article.count({
        where: {
          userId: currentUser.id,
          deletedAt: null,
        },
      }),
      // Drafts
      prisma.article.count({
        where: {
          userId: currentUser.id,
          status: 'DRAFT',
          deletedAt: null,
        },
      }),
      // Published
      prisma.article.count({
        where: {
          userId: currentUser.id,
          status: 'PUBLISHED',
          deletedAt: null,
        },
      }),
      // Scheduled
      prisma.article.count({
        where: {
          userId: currentUser.id,
          status: 'SCHEDULED',
          deletedAt: null,
        },
      }),
      // Archived
      prisma.article.count({
        where: {
          userId: currentUser.id,
          status: 'ARCHIVED',
          deletedAt: null,
        },
      }),
      // Total words
      prisma.article.aggregate({
        where: {
          userId: currentUser.id,
          deletedAt: null,
        },
        _sum: {
          wordCount: true,
        },
      }),
      // Total views
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

    // Get platform connection statistics
    const platformConnections = await prisma.platformConnection.findMany({
      where: {
        userId: currentUser.id,
        status: 'CONNECTED',
      },
      select: {
        platform: true,
      },
    });

    // Get publish statistics by platform
    const publishStatsByPlatform = await prisma.publishRecord.groupBy({
      by: ['platform', 'status'],
      where: {
        platformConnection: {
          userId: currentUser.id,
        },
      },
      _count: {
        id: true,
      },
    });

    // Transform publish stats into organized structure
    const platformStats: Record<string, any> = {};

    publishStatsByPlatform.forEach((stat) => {
      if (!platformStats[stat.platform]) {
        platformStats[stat.platform] = {
          platform: stat.platform,
          total: 0,
          published: 0,
          scheduled: 0,
          failed: 0,
        };
      }

      platformStats[stat.platform].total += stat._count.id;

      if (stat.status === 'PUBLISHED') {
        platformStats[stat.platform].published = stat._count.id;
      } else if (stat.status === 'SCHEDULED') {
        platformStats[stat.platform].scheduled = stat._count.id;
      } else if (stat.status === 'FAILED') {
        platformStats[stat.platform].failed = stat._count.id;
      }
    });

    // Get articles with their publish records
    const articlesWithPublishes = await prisma.article.findMany({
      where: {
        userId: currentUser.id,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
        publishRecords: {
          select: {
            platform: true,
            status: true,
          },
        },
      },
    });

    // Calculate articles published per platform
    const articlesPerPlatform: Record<string, Set<string>> = {};

    articlesWithPublishes.forEach((article) => {
      article.publishRecords.forEach((record) => {
        if (record.status === 'PUBLISHED') {
          if (!articlesPerPlatform[record.platform]) {
            articlesPerPlatform[record.platform] = new Set();
          }
          articlesPerPlatform[record.platform].add(article.id);
        }
      });
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await prisma.article.groupBy({
      by: ['status'],
      where: {
        userId: currentUser.id,
        createdAt: {
          gte: thirtyDaysAgo,
        },
        deletedAt: null,
      },
      _count: {
        id: true,
      },
    });

    const recentPublishes = await prisma.publishRecord.count({
      where: {
        platformConnection: {
          userId: currentUser.id,
        },
        publishedAt: {
          gte: thirtyDaysAgo,
        },
        status: 'PUBLISHED',
      },
    });

    // Calculate publishing rate
    const publishingRate = publishedArticles > 0
      ? ((Object.keys(articlesPerPlatform).reduce((sum, platform) => sum + articlesPerPlatform[platform].size, 0)) / publishedArticles).toFixed(2)
      : '0';

    // Get top performing articles
    const topArticles = await prisma.article.findMany({
      where: {
        userId: currentUser.id,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        views: true,
        publishRecords: {
          where: {
            status: 'PUBLISHED',
          },
          select: {
            platform: true,
          },
        },
      },
      orderBy: {
        views: 'desc',
      },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        // Article statistics
        articles: {
          total: totalArticles,
          draft: draftArticles,
          published: publishedArticles,
          scheduled: scheduledArticles,
          archived: archivedArticles,
          totalWords: totalWords._sum.wordCount || 0,
          totalViews: totalViews._sum.views || 0,
          avgWordsPerArticle: totalArticles > 0 ? Math.round((totalWords._sum.wordCount || 0) / totalArticles) : 0,
        },

        // Platform statistics
        platforms: {
          connected: platformConnections.length,
          connectedPlatforms: platformConnections.map(c => c.platform),
          stats: Object.values(platformStats),
          articlesPerPlatform: Object.entries(articlesPerPlatform).map(([platform, articles]) => ({
            platform,
            uniqueArticles: articles.size,
          })),
          publishingRate: parseFloat(publishingRate),
        },

        // Recent activity (last 30 days)
        recentActivity: {
          articlesCreated: recentActivity.reduce((sum, a) => sum + a._count.id, 0),
          articlesPublished: recentActivity.find(a => a.status === 'PUBLISHED')?._count.id || 0,
          articlesDrafted: recentActivity.find(a => a.status === 'DRAFT')?._count.id || 0,
          platformPublishes: recentPublishes,
        },

        // Top performers
        topArticles: topArticles.map(a => ({
          id: a.id,
          title: a.title,
          views: a.views,
          platformCount: a.publishRecords.length,
          platforms: a.publishRecords.map(p => p.platform),
        })),
      },
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch statistics',
      },
      { status: 500 }
    );
  }
}
