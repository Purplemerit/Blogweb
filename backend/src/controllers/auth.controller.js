const { ZodError } = require("zod");
const { authService } = require("../services/auth.service");
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/auth.validators");
const { sendError, sendSuccess } = require("../utils/http");

function setRefreshCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

async function signup(req, res) {
  try {
    const body = signupSchema.parse(req.body);
    const result = await authService.signup(body);
    setRefreshCookie(res, result.refreshToken);

    return sendSuccess(
      res,
      {
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      },
      201,
      result.message
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, "Validation failed", 400, error.issues);
    }
    const status = error.message === "Email already registered" ? 409 : 500;
    return sendError(res, error.message || "Failed to create account", status);
  }
}

async function login(req, res) {
  try {
    const body = loginSchema.parse(req.body);
    const result = await authService.login(body);

    setRefreshCookie(res, result.refreshToken);

    return sendSuccess(res, {
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, "Validation failed", 400, error.issues);
    }

    const status =
      error.message === "Invalid credentials"
        ? 401
        : error.message && error.message.includes("verify your email")
        ? 403
        : 500;

    return sendError(res, error.message || "Failed to login", status);
  }
}

async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return sendSuccess(res, {}, 200, "Logged out successfully");
  } catch (error) {
    return sendError(res, error.message || "Failed to logout");
  }
}

async function me(req, res) {
  return sendSuccess(res, { data: { user: req.user } });
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.body;
    if (!token) return sendError(res, "Token is required", 400);

    const result = await authService.verifyEmail(token);
    return sendSuccess(res, {}, 200, result.message);
  } catch (error) {
    return sendError(res, error.message || "Failed to verify email", 400);
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(email);
    return sendSuccess(res, { data: result }, 200, result.message);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, "Validation failed", 400, error.issues);
    }
    return sendError(res, error.message || "Failed to process request");
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(token, password);
    return sendSuccess(res, {}, 200, result.message);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(res, "Validation failed", 400, error.issues);
    }
    return sendError(res, error.message || "Failed to reset password", 400);
  }
}

async function refresh(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return sendError(res, "No refresh token provided", 401);

    const result = await authService.refreshAccessToken(refreshToken);
    return sendSuccess(res, { data: result });
  } catch (error) {
    return sendError(res, error.message || "Failed to refresh token", 401);
  }
}

module.exports = {
  signup,
  login,
  logout,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refresh,
};
