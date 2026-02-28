const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretkey';

const authMiddleware = {
  // Verify JWT token
  verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  },

  // Verify role
  verifyRole(roles) {
    return (req, res, next) => {
      authMiddleware.verifyToken(req, res, () => {
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Access denied' });
        }
        next();
      });
    };
  }
};

module.exports = authMiddleware;