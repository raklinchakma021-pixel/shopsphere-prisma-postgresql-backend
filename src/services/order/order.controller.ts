import { Request, Response } from "express";
import {
  createOrder,
  deleteOrder,
  deleteOrderByAdmin,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from "./order.service.js";
import { successResponse } from "../../utils/response.js";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const getId = (req: Request): string => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new Error("Invalid order ID");
  }

  return id;
};

export const createOrderController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      productId,
      quantity,
    } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID and quantity are required",
      });
    }

    const order = await createOrder({
      userId: req.user.userId,
      productId,
      quantity: Number(quantity),
    });

    return successResponse(
      res,
      201,
      "Order created successfully",
      order
    );
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create order",
    });
  }
};

export const getOrdersController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const orders =
      req.user.role === "ADMIN"
        ? await getAllOrders()
        : await getUserOrders(
            req.user.userId
          );

    return successResponse(
      res,
      200,
      "Orders retrieved successfully",
      orders
    );
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
    });
  }
};

export const getOrderController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = getId(req);

    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      req.user.role !== "ADMIN" &&
      order.user.id !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return successResponse(
      res,
      200,
      "Order retrieved successfully",
      order
    );
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }
};

export const updateOrderStatusController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = getId(req);

      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "PENDING",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      const order =
        await updateOrderStatus(id, {
          status,
        });

      return successResponse(
        res,
        200,
        "Order status updated successfully",
        order
      );
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
      });
    }
  };

export const deleteOrderController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = getId(req);

    if (req.user.role === "ADMIN") {
      await deleteOrderByAdmin(id);
    } else {
      await deleteOrder(
        id,
        req.user.userId
      );
    }

    return successResponse(
      res,
      200,
      "Order deleted successfully",
      null
    );
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete order",
    });
  }
};