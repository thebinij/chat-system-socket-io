import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SKIP_AUTH = true;

const authMiddleware = (req, res, next) => {
  let token;
  if (SKIP_AUTH) {
    next();
    return;
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, Invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Authorization token not found" });
  }
};

export default authMiddleware;
