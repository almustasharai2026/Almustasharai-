// Shared utilities for API handlers
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../server/src/config/constants');

function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function getAuthToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

function sendSuccess(res, data) {
  return res.status(200).json(data);
}

module.exports = {
  verifyToken,
  getAuthToken,
  sendError,
  sendSuccess
};
