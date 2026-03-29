const User = require('../models/user');
const { verifyToken } = require('../utils/jwt');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'مطلوب توكن' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'توكن غير صالح' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'توكن غير صالح' });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'غير مصرح' });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};