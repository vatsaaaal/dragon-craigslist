import jwt from "jsonwebtoken";
import { config } from "../config.js";

const JWT_SECRET = config.JWT_SECRET;

const getUserIdFromToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure res.locals exists and set user_id
    res.locals = res.locals || {};
    if (!decoded.userId) {
      console.error("user_id missing in token");
      return res.status(400).json({ error: "Invalid token: user_id not found" });
    }

    res.locals.user_id = decoded.userId;
    next(); // Pass control to the next middleware/handler
  } catch (err) {
    console.error("Failed to authenticate:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

export default getUserIdFromToken;
