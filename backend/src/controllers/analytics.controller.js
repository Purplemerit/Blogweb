const { prisma } = require("../db/prisma");
const { sendError, sendSuccess } = require("../utils/http");

async function getAnalytics(req, res) {
  try {
    const articleId = req.query.articleId ? String(req.query.articleId) : undefined;
    const platform = req.query.platform ? String(req.query.platform).toUpperCase() : undefined;

    const articleFilter = {
      article: {
        OR: [
          { userId: req.user.id },
          { collaborators: { some: { userId: req.user.id, status: "ACCEPTED" } } },
        ],
      },
      ...(articleId ? { articleId } : {}),
    };

    const [externalAnalytics, publishTypeAnalytics] = await Promise.all([
      prisma.platformAnalytics.findMany({
        where: {
          publishRecord: {
            ...articleFilter,
            ...(platform ? { platform } : {}),
          },
        },
        include: { publishRecord: true },
        orderBy: { lastSyncAt: "desc" },
      }),
      prisma.analytics.findMany({
        where: {
          ...articleFilter,
          ...(platform ? { platform } : {}),
        },
        orderBy: { date: "desc" },
        take: 200,
      }),
    ]);

    return sendSuccess(res, { data: { externalAnalytics, publishTypeAnalytics } });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch analytics");
  }
}

async function getAnalyticsStats(req, res) {
  try {
    const where = { userId: req.user.id, deletedAt: null };

    const [statusCounts, totals, platformConnectionStats] = await Promise.all([
      prisma.article.groupBy({ by: ["status"], where, _count: { _all: true } }),
      prisma.article.aggregate({ where, _sum: { wordCount: true, views: true }, _count: { _all: true } }),
      prisma.platformConnection.groupBy({ by: ["platform"], where: { userId: req.user.id }, _count: { _all: true } }),
    ]);

    const mapped = statusCounts.reduce((acc, row) => {
      acc[row.status] = row._count._all;
      return acc;
    }, {});

    return sendSuccess(res, {
      data: {
        stats: {
          totalArticles: totals._count._all,
          draftArticles: mapped.DRAFT || 0,
          publishedArticles: mapped.PUBLISHED || 0,
          scheduledArticles: mapped.SCHEDULED || 0,
          archivedArticles: mapped.ARCHIVED || 0,
          totalWords: totals._sum.wordCount || 0,
          totalViews: totals._sum.views || 0,
          platformConnectionStats: platformConnectionStats.map((item) => ({
            platform: item.platform,
            count: item._count._all,
          })),
        },
      },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch analytics stats");
  }
}

async function syncAnalytics(req, res) {
  try {
    const articleId = req.body.articleId ? String(req.body.articleId) : undefined;

    const publishRecords = await prisma.publishRecord.findMany({
      where: {
        article: {
          userId: req.user.id,
          ...(articleId ? { id: articleId } : {}),
        },
        status: "PUBLISHED",
      },
      include: { article: true },
    });

    const results = [];
    const errors = [];

    for (const record of publishRecords) {
      try {
        const analytics = {
          views: Math.floor(Math.random() * 1000),
          uniqueVisitors: Math.floor(Math.random() * 700),
          likes: Math.floor(Math.random() * 200),
          comments: Math.floor(Math.random() * 80),
          shares: Math.floor(Math.random() * 50),
          bookmarks: Math.floor(Math.random() * 40),
          avgReadTime: Math.floor(Math.random() * 400),
        };

        const synced = await prisma.platformAnalytics.upsert({
          where: { publishRecordId: record.id },
          create: {
            publishRecordId: record.id,
            ...analytics,
            lastSyncAt: new Date(),
          },
          update: {
            ...analytics,
            lastSyncAt: new Date(),
          },
        });

        results.push({
          articleId: record.articleId,
          platform: record.platform,
          analytics: synced,
        });
      } catch (error) {
        errors.push({ articleId: record.articleId, platform: record.platform, error: error.message });
      }
    }

    return sendSuccess(res, { data: { results, errors } });
  } catch (error) {
    return sendError(res, error.message || "Failed to sync analytics");
  }
}

module.exports = {
  getAnalytics,
  getAnalyticsStats,
  syncAnalytics,
};
