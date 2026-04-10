import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import prisma from '@/lib/prisma';
import { DevToAnalyticsService } from '@/lib/services/analytics/devto-analytics.service';
import { WordPressAnalyticsService } from '@/lib/services/analytics/wordpress-analytics.service';
import { HashnodeAnalyticsService } from '@/lib/services/analytics/hashnode-analytics.service';
import { GhostAnalyticsService } from '@/lib/services/analytics/ghost-analytics.service';
import { WixAnalyticsService } from '@/lib/services/analytics/wix-analytics.service';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { articleId } = body;

    // Get all published records for the user's articles
    const publishRecords = await prisma.publishRecord.findMany({
      where: {
        status: 'PUBLISHED',
        platformPostId: { not: null },
        ...(articleId && { articleId }),
        platformConnection: {
          userId: currentUser.id,
        },
      },
      include: {
        platformConnection: true,
        article: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const results: any[] = [];
    const errors: any[] = [];

    for (const record of publishRecords) {
      try {
        let analyticsData: any = null;

        // Fetch analytics based on platform
        switch (record.platform) {
          case 'DEVTO': {
            const credentials = record.platformConnection.credentials;
            const result = await DevToAnalyticsService.getArticleAnalytics(
              credentials,
              record.platformPostId!
            );

            if (result.success && result.data) {
              analyticsData = {
                views: result.data.views,
                likes: result.data.reactions,
                comments: result.data.comments,
                reactions: {
                  public: result.data.publicReactionsCount,
                  positive: result.data.positiveReactionsCount,
                },
              };
            }
            break;
          }

          case 'WORDPRESS': {
            const credentials = JSON.parse(record.platformConnection.credentials);
            const result = await WordPressAnalyticsService.getPostAnalytics(
              credentials.accessToken,
              credentials.blogId,
              record.platformPostId!
            );

            if (result.success && result.data) {
              analyticsData = {
                views: result.data.views,
                uniqueVisitors: result.data.visitors,
                likes: result.data.likes,
                comments: result.data.comments,
              };
            }
            break;
          }

          case 'HASHNODE': {
            const credentials = record.platformConnection.credentials;
            const result = await HashnodeAnalyticsService.getPostAnalytics(
              credentials,
              record.platformPostId!
            );

            if (result.success && result.data) {
              analyticsData = {
                views: result.data.views,
                likes: result.data.reactions,
                comments: result.data.comments,
                reactions: {
                  total: result.data.reactions,
                  responses: result.data.responseCount,
                },
              };
            }
            break;
          }

          case 'GHOST': {
            const credentials = record.platformConnection.credentials;
            const metadata = record.platformConnection.metadata as { apiUrl: string };
            const result = await GhostAnalyticsService.getPostAnalytics(
              metadata.apiUrl,
              credentials,
              record.platformPostId!
            );

            if (result.success && result.data) {
              analyticsData = {
                views: result.data.views,
              };
            }
            break;
          }

          case 'WIX': {
            const credentials = JSON.parse(record.platformConnection.credentials);
            const metadata = record.platformConnection.metadata as { siteId: string };
            const result = await WixAnalyticsService.getPostAnalytics(
              credentials.accessToken,
              metadata.siteId,
              record.platformPostId!
            );

            if (result.success && result.data) {
              analyticsData = {
                views: result.data.views,
                likes: result.data.likes,
                comments: result.data.comments,
                shares: result.data.shares,
              };
            }
            break;
          }

          default:
            continue;
        }

        if (analyticsData) {
          // Upsert analytics data
          await prisma.platformAnalytics.upsert({
            where: {
              publishRecordId: record.id,
            },
            create: {
              publishRecordId: record.id,
              views: analyticsData.views || 0,
              uniqueVisitors: analyticsData.uniqueVisitors || 0,
              likes: analyticsData.likes || 0,
              comments: analyticsData.comments || 0,
              shares: analyticsData.shares || 0,
              bookmarks: analyticsData.bookmarks || 0,
              reactions: analyticsData.reactions || null,
              externalData: analyticsData,
              lastSyncAt: new Date(),
            },
            update: {
              views: analyticsData.views || 0,
              uniqueVisitors: analyticsData.uniqueVisitors || 0,
              likes: analyticsData.likes || 0,
              comments: analyticsData.comments || 0,
              shares: analyticsData.shares || 0,
              bookmarks: analyticsData.bookmarks || 0,
              reactions: analyticsData.reactions || null,
              externalData: analyticsData,
              lastSyncAt: new Date(),
            },
          });

          results.push({
            articleId: record.articleId,
            articleTitle: record.article.title,
            platform: record.platform,
            analytics: analyticsData,
          });
        }
      } catch (error: any) {
        errors.push({
          articleId: record.articleId,
          platform: record.platform,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        synced: results.length,
        results,
        errors: errors.length > 0 ? errors : undefined,
      },
      message: `Synced analytics for ${results.length} published articles`,
    });
  } catch (error: any) {
    console.error('Analytics sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync analytics',
      },
      { status: 500 }
    );
  }
}
