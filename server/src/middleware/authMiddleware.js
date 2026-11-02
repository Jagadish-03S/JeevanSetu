const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jeevansetu-secure-pilot-secret-2026';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Authentication token required.'
    });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired authentication token.'
    });
  }
};

const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
    } catch (e) {
      // Ignore invalid optional token
    }
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuthenticateToken,
  JWT_SECRET
};
