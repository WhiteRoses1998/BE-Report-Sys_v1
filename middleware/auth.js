const jwt = require("jsonwebtoken");

/**
 * ================================
 *  ตรวจ Token (ต้องมี token)
 * ================================
 */
exports.protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { User_ID, Username, Role, Dep_ID }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/**
 * ================================
 *  จำกัดสิทธิ์ตาม Role
 * ================================
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.Role)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permission",
        required: roles,
        your_role: req.user.Role,
      });
    }

    next();
  };
};
