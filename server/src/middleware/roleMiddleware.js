const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden. No roles associated with current user session.'
      });
    }

    const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: `Forbidden. Action requires one of these authorized roles: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};

