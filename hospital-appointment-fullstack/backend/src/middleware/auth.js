const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;

    if (!token)
      return res.status(401).json({ message: "Please login first." });

    const data = jwt.verify(token, process.env.JWT_SECRET);

    if (data.role === "ADMIN") {
      req.user = { id: "admin", role: "ADMIN" };
      return next();
    }

    const user = await User.findById(data.id);

    if (!user)
      return res.status(401).json({ message: "Account not found." });

    req.user = { id: user._id.toString(), role: user.role, name: user.name }; next();
  } catch (e) { res.status(401).json({ message: "Invalid or expired token." }); }
}
function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: "You do not have permission." });
}
module.exports = { protect, allowRoles };
