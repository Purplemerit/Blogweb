const { prisma } = require("../db/prisma");
const { sendError, sendSuccess } = require("../utils/http");

async function listPublicBlogs(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const search = (req.query.search || "").toString().trim();
    const skip = (page - 1) * limit;

    const where = {
      status: "PUBLISHED",
      isPublicOnPublishType: true,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { excerpt: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          slug: true,
          coverImage: true,
          publishedAt: true,
          readTime: true,
          wordCount: true,
          user: { select: { id: true, name: true, avatar: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return sendSuccess(res, {
      data: {
        articles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return sendError(res, error.message || "Failed to get public blogs");
  }
}

async function getPublicBlogById(req, res) {
  try {
    const { id } = req.params;

    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        status: "PUBLISHED",
        isPublicOnPublishType: true,
        deletedAt: null,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true, bio: true },
        },
        articleTags: { include: { tag: true } },
      },
    });

    if (!article) return sendError(res, "Blog not found", 404);

    return sendSuccess(res, { data: { article } });
  } catch (error) {
    return sendError(res, error.message || "Failed to get blog");
  }
}

module.exports = { listPublicBlogs, getPublicBlogById };
