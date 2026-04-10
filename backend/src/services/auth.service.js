const { prisma } = require("../db/prisma");
const { hashPassword, verifyPassword } = require("../utils/password");
const {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
  verifyRefreshToken,
} = require("../utils/jwt");

class AuthService {
  async signup(data) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("Email already registered");

    const password = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        createdAt: true,
      },
    });

    const verificationToken = generateVerificationToken(user.id);
    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
      message: "Account created successfully. Please verify your email.",
    };
  }

  async login(data) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        emailVerified: true,
      },
    });

    if (!user) throw new Error("Invalid credentials");

    const isValidPassword = await verifyPassword(data.password, user.password);
    if (!isValidPassword) throw new Error("Invalid credentials");

    if (!user.emailVerified) {
      throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
    }

    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async verifyEmail(token) {
    const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });
    if (!verificationToken) throw new Error("Invalid verification token");
    if (verificationToken.expiresAt < new Date()) throw new Error("Verification token has expired");
    if (verificationToken.type !== "EMAIL_VERIFICATION") throw new Error("Invalid token type");

    await prisma.user.update({ where: { id: verificationToken.userId }, data: { emailVerified: true } });
    await prisma.verificationToken.delete({ where: { id: verificationToken.id } });

    return { message: "Email verified successfully" };
  }

  async forgotPassword(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: "If the email exists, a password reset link has been sent" };
    }

    const resetToken = generatePasswordResetToken(user.id);

    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: "PASSWORD_RESET" },
    });

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        type: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    return {
      message: "If the email exists, a password reset link has been sent",
      resetToken,
    };
  }

  async resetPassword(token, newPassword) {
    const resetToken = await prisma.verificationToken.findUnique({ where: { token } });
    if (!resetToken) throw new Error("Invalid reset token");
    if (resetToken.expiresAt < new Date()) throw new Error("Reset token has expired");
    if (resetToken.type !== "PASSWORD_RESET") throw new Error("Invalid token type");

    const password = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: resetToken.userId }, data: { password } });

    await prisma.refreshToken.deleteMany({ where: { userId: resetToken.userId } });
    await prisma.verificationToken.delete({ where: { id: resetToken.id } });

    return { message: "Password reset successfully" };
  }

  async refreshAccessToken(refreshToken) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (_error) {
      throw new Error("Invalid refresh token");
    }

    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) throw new Error("Invalid or expired refresh token");

    return {
      accessToken: generateAccessToken({ userId: payload.userId, email: payload.email }),
    };
  }

  async logout(refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { message: "Logged out successfully" };
  }
}

const authService = new AuthService();
module.exports = { authService };
