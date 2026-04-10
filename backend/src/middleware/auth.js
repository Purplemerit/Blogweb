const { prisma } = require("../db/prisma");
const { verifyAccessToken } = require("../utils/jwt");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "No access token provided" });
    }

    const accessToken = authHeader.substring(7);
    const payload = verifyAccessToken(accessToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        avatar: true,
        bio: true,
        website: true,
        twitterHandle: true,
        linkedinUrl: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    req.user = user;
    req.accessToken = accessToken;
    return next();
  } catch (_error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
