import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { client } from "../server.js";

const JWT_SECRET = config.JWT_SECRET;

const getUserIdFromToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ loggedIn: false, message: 'Not authenticated' });
      }
    
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded.userId);
        res.status(200).json({ loggedIn: true, userId: decoded.userId });
      } catch (error) {
        console.error("Failed to authenticate:", error);
        res.status(401).json({ loggedIn: false, message: 'Invalid token' });
      }
};

export default getUserIdFromToken;
