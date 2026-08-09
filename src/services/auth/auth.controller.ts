import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import {
  loginUser,
  registerUser,
} from "./auth.service.js";
import { successResponse } from "../../utils/response.js";
import { AuthRequest } from "../../middlewares/auth.middleware.js";
export const getMe = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return successResponse(
      res,
      200,
      "Current user retrieved successfully",
      user
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve current user",
    });
  }
};
export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await registerUser(req.body);

    return successResponse(
      res,
      201,
      "User registered successfully",
      result
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await loginUser(req.body);

    return successResponse(
      res,
      200,
      "Login successful",
      result
    );
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
};