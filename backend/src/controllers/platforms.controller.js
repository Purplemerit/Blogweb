const { prisma } = require("../db/prisma");
const { sendError, sendSuccess } = require("../utils/http");

function parseCredentials(raw) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return {};
  }
}

async function listConnections(req, res) {
  try {
    const connections = await prisma.platformConnection.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, { data: { connections } });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch connections");
  }
}

async function removeConnection(req, res) {
  try {
    const { id } = req.params;

    await prisma.platformConnection.deleteMany({
      where: { id, userId: req.user.id },
    });

    return sendSuccess(res, {}, 200, "Connection removed");
  } catch (error) {
    return sendError(res, error.message || "Failed to remove connection");
  }
}

async function connectPlatform(req, res) {
  try {
    const platform = String(req.params.platform || "").toUpperCase();
    const { credentials = {}, metadata } = req.body;

    if (!platform) return sendError(res, "Platform is required", 400);

    const connection = await prisma.platformConnection.upsert({
      where: {
        userId_platform: {
          userId: req.user.id,
          platform,
        },
      },
      create: {
        userId: req.user.id,
        platform,
        status: "CONNECTED",
        credentials: JSON.stringify(credentials),
        metadata,
        lastSyncAt: new Date(),
      },
      update: {
        status: "CONNECTED",
        credentials: JSON.stringify(credentials),
        metadata,
        lastSyncAt: new Date(),
      },
    });

    return sendSuccess(res, { data: { connection } }, 200, `${platform} connected successfully`);
  } catch (error) {
    return sendError(res, error.message || "Failed to connect platform");
  }
}

async function publishToPlatform(req, res) {
  try {
    const platform = String(req.params.platform || "").toUpperCase();
    const { articleId } = req.body;

    if (!articleId) return sendError(res, "articleId is required", 400);

    const [article, connection] = await Promise.all([
      prisma.article.findFirst({
        where: {
          id: articleId,
          deletedAt: null,
          OR: [
            { userId: req.user.id },
            { collaborators: { some: { userId: req.user.id, status: "ACCEPTED" } } },
          ],
        },
      }),
      prisma.platformConnection.findUnique({
        where: {
          userId_platform: {
            userId: req.user.id,
            platform,
          },
        },
      }),
    ]);

    if (!article) return sendError(res, "Article not found", 404);
    if (!connection || connection.status !== "CONNECTED") {
      return sendError(res, `${platform} is not connected`, 400);
    }

    const creds = parseCredentials(connection.credentials);
    const platformPostId = `post_${platform.toLowerCase()}_${Date.now()}`;
    const url = creds.siteUrl
      ? `${creds.siteUrl.replace(/\/$/, "")}/${article.slug}`
      : `https://${platform.toLowerCase()}.example.com/${article.slug}`;

    const publishRecord = await prisma.publishRecord.create({
      data: {
        articleId: article.id,
        platformConnectionId: connection.id,
        platform,
        platformPostId,
        url,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    if (article.status === "DRAFT") {
      await prisma.article.update({
        where: { id: article.id },
        data: { status: "PUBLISHED", publishedAt: article.publishedAt || new Date() },
      });
    }

    return sendSuccess(
      res,
      {
        data: {
          publishRecord,
          postId: platformPostId,
          url,
        },
      },
      200,
      `Published to ${platform}`
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to publish to platform");
  }
}

async function publishMultiple(req, res) {
  try {
    const { articleId, platforms = [] } = req.body;
    if (!articleId || !Array.isArray(platforms) || platforms.length === 0) {
      return sendError(res, "articleId and platforms[] are required", 400);
    }

    const results = [];
    const errors = [];

    for (const platformName of platforms) {
      const platform = String(platformName).toUpperCase();
      const connection = await prisma.platformConnection.findUnique({
        where: {
          userId_platform: {
            userId: req.user.id,
            platform,
          },
        },
      });

      if (!connection || connection.status !== "CONNECTED") {
        errors.push({ platform, error: "Not connected" });
        continue;
      }

      const platformPostId = `post_${platform.toLowerCase()}_${Date.now()}`;
      const publishRecord = await prisma.publishRecord.create({
        data: {
          articleId,
          platformConnectionId: connection.id,
          platform,
          platformPostId,
          url: `https://${platform.toLowerCase()}.example.com/${articleId}`,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

      results.push({ platform, publishRecord });
    }

    return sendSuccess(res, { data: { results, errors } }, 200, "Publish completed");
  } catch (error) {
    return sendError(res, error.message || "Failed to publish multiple");
  }
}

async function updatePost(req, res) {
  try {
    const { publishRecordId, title, content, excerpt } = req.body;
    if (!publishRecordId) return sendError(res, "publishRecordId is required", 400);

    const record = await prisma.publishRecord.findFirst({
      where: {
        id: publishRecordId,
        article: { userId: req.user.id },
      },
      include: { article: true },
    });

    if (!record) return sendError(res, "Publish record not found", 404);

    await prisma.article.update({
      where: { id: record.articleId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(excerpt !== undefined ? { excerpt } : {}),
      },
    });

    return sendSuccess(res, { data: { publishRecord: record } }, 200, "Post updated successfully");
  } catch (error) {
    return sendError(res, error.message || "Failed to update platform post");
  }
}

module.exports = {
  listConnections,
  removeConnection,
  connectPlatform,
  publishToPlatform,
  publishMultiple,
  updatePost,
};
