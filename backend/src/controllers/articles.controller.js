const { prisma } = require("../db/prisma");
const { sendError, sendSuccess } = require("../utils/http");

function createSlug(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${Date.now()}`
  );
}

async function listArticles(req, res) {
  try {
    const limit = Number(req.query.limit || 10);
    const offset = Number(req.query.offset || 0);
    const status = req.query.status ? String(req.query.status) : undefined;
    const folderId = req.query.folderId ? String(req.query.folderId) : undefined;

    const where = {
      deletedAt: null,
      OR: [
        { userId: req.user.id },
        {
          collaborators: {
            some: {
              userId: req.user.id,
              status: { in: ["ACCEPTED", "PENDING"] },
            },
          },
        },
      ],
      ...(status ? { status } : {}),
      ...(folderId ? { folderId } : {}),
    };

    const includePublishRecords = !req.query.limit || Number(req.query.limit) > 10;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          status: true,
          wordCount: true,
          readingTime: true,
          views: true,
          publishedAt: true,
          scheduleAt: true,
          createdAt: true,
          updatedAt: true,
          ...(includePublishRecords
            ? {
                publishRecords: {
                  select: { platform: true, url: true },
                  where: { status: "PUBLISHED" },
                },
              }
            : {}),
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.setHeader("Cache-Control", "private, max-age=30, stale-while-revalidate=60");

    return sendSuccess(res, {
      data: {
        articles,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch articles");
  }
}

async function createArticle(req, res) {
  try {
    const { title, content, excerpt, folderId, toneOfVoice, contentFramework } = req.body;
    if (!title) return sendError(res, "Title is required", 400);

    const safeContent = content || "";
    const wordCount = safeContent ? safeContent.trim().split(/\s+/).length : 0;
    const readingTime = Math.ceil(wordCount / 200);

    const article = await prisma.article.create({
      data: {
        userId: req.user.id,
        title,
        slug: createSlug(title),
        content: safeContent,
        excerpt,
        folderId,
        wordCount,
        readingTime,
        toneOfVoice,
        contentFramework,
        status: "DRAFT",
      },
    });

    return sendSuccess(res, { data: { article } }, 201, "Article created successfully");
  } catch (error) {
    return sendError(res, error.message || "Failed to create article");
  }
}

async function getArticle(req, res) {
  try {
    const { id } = req.params;
    const article = await prisma.article.findFirst({
      where: {
        id,
        deletedAt: null,
        OR: [
          { userId: req.user.id },
          {
            collaborators: {
              some: {
                userId: req.user.id,
                status: { in: ["ACCEPTED", "PENDING"] },
              },
            },
          },
        ],
      },
      include: {
        articleTags: { include: { tag: true } },
        folder: true,
        collaborators: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
      },
    });

    if (!article) return sendError(res, "Article not found", 404);
    return sendSuccess(res, { data: { article } });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch article");
  }
}

async function updateArticle(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.article.findFirst({
      where: {
        id,
        deletedAt: null,
        OR: [
          { userId: req.user.id },
          {
            collaborators: {
              some: {
                userId: req.user.id,
                status: "ACCEPTED",
                role: { in: ["EDITOR", "OWNER"] },
              },
            },
          },
        ],
      },
    });

    if (!existing) return sendError(res, "Article not found or no permission", 404);

    const payload = { ...req.body };
    if (payload.content !== undefined) {
      const content = payload.content || "";
      payload.wordCount = content ? content.trim().split(/\s+/).length : 0;
      payload.readingTime = Math.ceil(payload.wordCount / 200);
    }

    if (payload.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      payload.publishedAt = new Date();
    }

    const article = await prisma.article.update({
      where: { id },
      data: payload,
    });

    const versionCount = await prisma.articleVersion.count({ where: { articleId: id } });
    await prisma.articleVersion.create({
      data: {
        articleId: id,
        version: versionCount + 1,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        createdBy: req.user.id,
      },
    });

    return sendSuccess(res, { data: { article } });
  } catch (error) {
    return sendError(res, error.message || "Failed to update article");
  }
}

async function listArticlePublishes(req, res) {
  try {
    const { id } = req.params;
    const records = await prisma.publishRecord.findMany({
      where: { articleId: id },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, { data: { records } });
  } catch (error) {
    return sendError(res, error.message || "Failed to fetch publish records");
  }
}

async function publishToPublishType(req, res) {
  try {
    const { id } = req.params;
    const article = await prisma.article.findFirst({ where: { id, userId: req.user.id, deletedAt: null } });
    if (!article) return sendError(res, "Article not found", 404);

    const updated = await prisma.article.update({
      where: { id },
      data: {
        isPublicOnPublishType: true,
        status: "PUBLISHED",
        publishedAt: article.publishedAt || new Date(),
      },
    });

    return sendSuccess(res, { data: { article: updated } }, 200, "Article published on PublishType");
  } catch (error) {
    return sendError(res, error.message || "Failed to publish article");
  }
}

async function publishToBlogAi(req, res) {
  return publishToPublishType(req, res);
}

async function exportArticle(req, res) {
  try {
    const { id } = req.params;
    const article = await prisma.article.findFirst({ where: { id, userId: req.user.id, deletedAt: null } });
    if (!article) return sendError(res, "Article not found", 404);

    return sendSuccess(res, {
      data: {
        format: (req.query.format || "json").toString(),
        article,
      },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to export article");
  }
}

async function fixStatus(req, res) {
  try {
    const draftArticlesWithPublishRecords = await prisma.article.findMany({
      where: {
        userId: req.user.id,
        status: "DRAFT",
        publishRecords: {
          some: {
            status: "PUBLISHED",
          },
        },
      },
      include: {
        publishRecords: {
          where: { status: "PUBLISHED" },
          orderBy: { publishedAt: "asc" },
          take: 1,
        },
      },
    });

    const updatedArticles = await Promise.all(
      draftArticlesWithPublishRecords.map((article) =>
        prisma.article.update({
          where: { id: article.id },
          data: {
            status: "PUBLISHED",
            publishedAt: article.publishRecords[0]?.publishedAt || new Date(),
          },
        })
      )
    );

    return sendSuccess(
      res,
      {
        data: {
          count: updatedArticles.length,
          articleIds: updatedArticles.map((article) => article.id),
        },
      },
      200,
      `Updated ${updatedArticles.length} articles from DRAFT to PUBLISHED`
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to fix article status");
  }
}

module.exports = {
  listArticles,
  createArticle,
  getArticle,
  updateArticle,
  listArticlePublishes,
  publishToPublishType,
  publishToBlogAi,
  exportArticle,
  fixStatus,
};
