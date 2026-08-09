import { Request, Response } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./user.service.js";
import { successResponse } from "../../utils/response.js";

const getUserIdFromParams = (req: Request): string => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new Error("Invalid user ID");
  }

  return id;
};

export const getUsers = async (
  _req: Request,
  res: Response
) => {
  try {
    const users = await getAllUsers();

    return successResponse(
      res,
      200,
      "Users retrieved successfully",
      users
    );
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
};

export const getUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getUserIdFromParams(req);

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return successResponse(
      res,
      200,
      "User retrieved successfully",
      user
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to retrieve user",
    });
  }
};

export const updateUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getUserIdFromParams(req);

    const user = await updateUser(id, req.body);

    return successResponse(
      res,
      200,
      "User updated successfully",
      user
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update user",
    });
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = getUserIdFromParams(req);

    const user = await deleteUser(id);

    return successResponse(
      res,
      200,
      "User deleted successfully",
      user
    );
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete user",
    });
  }
};