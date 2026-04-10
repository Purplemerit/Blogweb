const { ZodError } = require("zod");
const { prisma } = require("../db/prisma");
const { verifyPassword, hashPassword } = require("../utils/password");
const {
  updateProfileSchema,
  changePasswordSchema,
  updateSettingsSchema,
} = require("../validators/auth.validators");
const { sendError, sendSuccess } = require("../utils/http");

const PLAN_LIMITS = {
  FREE: { maxArticlesPerMonth: 10, maxDrafts: 50, maxPlatformConnections: 2 },
  STARTER: { maxArticlesPerMonth: 100, maxDrafts: 300, maxPlatformConnections: 5 },
  CREATOR: { maxArticlesPerMonth: 500, maxDrafts: 1000, maxPlatformConnections: 20 },
  PROFESSIONAL: { maxArticlesPerMonth: 5000, maxDrafts: 10000, maxPlatformConnections: 100 },
};

async function updateProfile(req, res) {
  try {
    const parsed = updateProfileSchema.parse(req.body);
    const data = Object.fromEntries(Object.entries(parsed).filter(([, v]) => v !== undefined));

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        website: true,
        twitterHandle: true,
        linkedinUrl: true,
        updatedAt: true,
      },
    });

    return sendSuccess(res, { data: { user } }, 200, "Profile updated successfully");
  } catch (error) {
    if (error instanceof ZodError) return sendError(res, "Validation failed", 400, error.issues);
    return sendError(res, error.message || "Failed to update profile");
  }
}

async function changePassword(req, res) {
  try {
    const body = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, password: true },
    });

    if (!user) return sendError(res, "User not found", 404);

    const ok = await verifyPassword(body.currentPassword, user.password);
    if (!ok) return sendError(res, "Current password is incorrect", 400);

    const hashedPassword = await hashPassword(body.newPassword);

    await prisma.$transaction([
      prisma.user.update({ where: { id: req.user.id }, data: { password: hashedPassword } }),
      prisma.refreshToken.deleteMany({ where: { userId: req.user.id } }),
    ]);

    return sendSuccess(res, {}, 200, "Password changed successfully");
  } catch (error) {
    if (error instanceof ZodError) return sendError(res, "Validation failed", 400, error.issues);
    return sendError(res, error.message || "Failed to change password");
  }
}

async function getSettings(req, res) {
  try {
    let settings = await prisma.userSettings.findUnique({ where: { userId: req.user.id } });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: req.user.id,
          defaultPlatforms: [],
        },
      });
    }

    return sendSuccess(res, { data: { settings } });
  } catch (error) {
    return sendError(res, error.message || "Failed to get settings");
  }
}

async function updateSettings(req, res) {
  try {
    const parsed = updateSettingsSchema.parse(req.body);

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        defaultPlatforms: [],
        ...parsed,
      },
      update: parsed,
    });

    return sendSuccess(res, { data: { settings } }, 200, "Settings updated successfully");
  } catch (error) {
    if (error instanceof ZodError) return sendError(res, "Validation failed", 400, error.issues);
    return sendError(res, error.message || "Failed to update settings");
  }
}

async function getUserStats(req, res) {
  try {
    const where = { userId: req.user.id, deletedAt: null };

    const [totalArticles, statusCounts, sumFields] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.groupBy({ by: ["status"], where, _count: { _all: true } }),
      prisma.article.aggregate({ where, _sum: { wordCount: true, views: true } }),
    ]);

    const statsMap = statusCounts.reduce((acc, row) => {
      acc[row.status] = row._count._all;
      return acc;
    }, {});

    return sendSuccess(res, {
      data: {
        stats: {
          totalArticles,
          publishedCount: statsMap.PUBLISHED || 0,
          draftsCount: statsMap.DRAFT || 0,
          scheduledCount: statsMap.SCHEDULED || 0,
          archivedCount: statsMap.ARCHIVED || 0,
          totalWords: sumFields._sum.wordCount || 0,
          totalViews: sumFields._sum.views || 0,
        },
      },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to get stats");
  }
}

async function getSubscriptionUsage(req, res) {
  try {
    const plan = req.user.subscriptionPlan || "FREE";
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;

    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const [articlesThisMonth, drafts, platformConnections] = await Promise.all([
      prisma.article.count({
        where: {
          userId: req.user.id,
          createdAt: { gte: start, lt: end },
          deletedAt: null,
        },
      }),
      prisma.article.count({
        where: { userId: req.user.id, status: "DRAFT", deletedAt: null },
      }),
      prisma.platformConnection.count({ where: { userId: req.user.id } }),
    ]);

    return sendSuccess(res, {
      data: {
        plan,
        articlesThisMonth,
        maxArticlesPerMonth: limits.maxArticlesPerMonth,
        drafts,
        maxDrafts: limits.maxDrafts,
        platformConnections,
        maxPlatformConnections: limits.maxPlatformConnections,
        isOverLimit:
          articlesThisMonth > limits.maxArticlesPerMonth ||
          drafts > limits.maxDrafts ||
          platformConnections > limits.maxPlatformConnections,
      },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to get subscription usage");
  }
}

async function deleteAccount(req, res) {
  try {
    await prisma.$transaction([
      prisma.article.deleteMany({ where: { userId: req.user.id } }),
      prisma.blog.deleteMany({ where: { userId: req.user.id } }),
      prisma.platformConnection.deleteMany({ where: { userId: req.user.id } }),
      prisma.folder.deleteMany({ where: { userId: req.user.id } }),
      prisma.activityLog.deleteMany({ where: { userId: req.user.id } }),
      prisma.image.deleteMany({ where: { userId: req.user.id } }),
      prisma.userSettings.deleteMany({ where: { userId: req.user.id } }),
      prisma.refreshToken.deleteMany({ where: { userId: req.user.id } }),
      prisma.verificationToken.deleteMany({ where: { userId: req.user.id } }),
      prisma.user.delete({ where: { id: req.user.id } }),
    ]);

    return sendSuccess(res, {}, 200, "Account deleted successfully");
  } catch (error) {
    return sendError(res, error.message || "Failed to delete account");
  }
}

async function searchUsers(req, res) {
  try {
    const q = (req.query.q || "").toString().trim();
    if (q.length < 2) return sendError(res, "Query must be at least 2 characters", 400);

    const users = await prisma.user.findMany({
      where: {
        id: { not: req.user.id },
        OR: [{ email: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
      take: 10,
    });

    return sendSuccess(res, { data: users });
  } catch (error) {
    return sendError(res, error.message || "Failed to search users");
  }
}

module.exports = {
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
  getUserStats,
  getSubscriptionUsage,
  deleteAccount,
  searchUsers,
};
