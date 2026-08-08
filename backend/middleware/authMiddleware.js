const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("TOKEN:", token);
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);
    req.user = await User.findById(decoded.id).select("-password");
    console.log("USER:", req.user);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found."
      });
    }

    next();

  } catch (error) {

  console.log("JWT ERROR:", error.message);

  return res.status(401).json({
    success: false,
    message: "Invalid Token"
  });

}
};

module.exports = protect;