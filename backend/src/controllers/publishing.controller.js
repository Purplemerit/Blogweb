const { prisma } = require("../db/prisma");
const { env } = require("../config/env");
const { sendError, sendSuccess } = require("../utils/http");

async function processQueue(req, res) {
  try {
    if (req.method === "GET" && env.NODE_ENV === "production") {
      return sendError(res, "GET is disabled in production", 405);
    }

    if (req.method === "POST") {
      const auth = req.headers.authorization || "";
      const token = auth.startsWith("Bearer ") ? auth.substring(7) : "";
      if (!env.CRON_SECRET || token !== env.CRON_SECRET) {
        return sendError(res, "Unauthorized cron trigger", 401);
      }
    }

    const pending = await prisma.publishQueue.findMany({
      where: {
        status: { in: ["PENDING", "FAILED"] },
        OR: [{ scheduleAt: null }, { scheduleAt: { lte: new Date() } }],
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    let processedCount = 0;

    for (const item of pending) {
      try {
        const article = await prisma.article.findUnique({ where: { id: item.articleId } });
        if (!article) {
          await prisma.publishQueue.update({
            where: { id: item.id },
            data: { status: "FAILED", attempts: { increment: 1 }, error: "Article not found" },
          });
          continue;
        }

        await prisma.publishQueue.update({
          where: { id: item.id },
          data: { status: "COMPLETED", processedAt: new Date(), error: null },
        });

        processedCount += 1;
      } catch (error) {
        await prisma.publishQueue.update({
          where: { id: item.id },
          data: {
            status: "FAILED",
            attempts: { increment: 1 },
            error: error.message || "Queue processing failed",
          },
        });
      }
    }

    return sendSuccess(res, { data: { processedCount, total: pending.length } }, 200, "Queue processed successfully");
  } catch (error) {
    return sendError(res, error.message || "Failed to process queue");
  }
}

async function retryFailed(req, res) {
  try {
    const failedItems = await prisma.publishQueue.findMany({
      where: { status: "FAILED", attempts: { lt: 5 } },
      orderBy: { updatedAt: "asc" },
      take: 100,
    });

    await prisma.$transaction(
      failedItems.map((item) =>
        prisma.publishQueue.update({
          where: { id: item.id },
          data: {
            status: "PENDING",
            error: null,
          },
        })
      )
    );

    return sendSuccess(
      res,
      { data: { retriedCount: failedItems.length } },
      200,
      "Failed publishing records marked for retry"
    );
  } catch (error) {
    return sendError(res, error.message || "Failed to retry failed publishes");
  }
}

module.exports = { processQueue, retryFailed };
