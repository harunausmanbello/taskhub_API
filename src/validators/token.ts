import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";

import AuthRequest from "../dtos/token";

// Middleware to verify JWT token
const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers["x-auth-token"] as string;
  if (!token) {
    return res.status(401).json({ message: "Missing JWT token" });
  }

  jwt.verify(token, config.get<string>("JWT.TOKEN"), (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Invalid JWT token" });
    }
    req.payloadData = payload;
    next();
  });
};

export default verifyToken;
