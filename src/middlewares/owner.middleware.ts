import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";

export const requireOwnerOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { id } = req.params;

  if (
    req.user.userId !== id &&
    req.user.role !== "ADMIN"
  ) {
    return res.status(403).json({
      success: false,
      message: "You can only modify your own account",
    });
  }

  next();
};