const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function generateAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

function generateVerificationToken(userId) {
  return jwt.sign({ userId, purpose: "email_verification" }, env.JWT_SECRET, { expiresIn: "24h" });
}

function generatePasswordResetToken(userId) {
  return jwt.sign({ userId, purpose: "password_reset" }, env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
};
