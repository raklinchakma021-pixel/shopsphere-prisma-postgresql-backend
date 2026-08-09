import { prisma } from "../../lib/prisma.js";

interface CreateOrderInput {
  userId: string;
  productId: string;
  quantity: number;
}

interface UpdateOrderStatusInput {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
}

export const createOrder = async (
  input: CreateOrderInput
) => {
  if (input.quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findFirst({
      where: {
        id: input.productId,
        isDeleted: false,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.status === "INACTIVE") {
      throw new Error("Product is currently inactive");
    }

    if (product.stock < input.quantity) {
      throw new Error("Insufficient stock");
    }

    const total =
      Number(product.price) * input.quantity;

    const order = await tx.order.create({
      data: {
        userId: input.userId,
        productId: input.productId,
        quantity: input.quantity,
        total,
        status: "PENDING",
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const remainingStock =
      product.stock - input.quantity;

    await tx.product.update({
      where: {
        id: product.id,
      },
      data: {
        stock: remainingStock,
        status:
          remainingStock === 0
            ? "OUT_OF_STOCK"
            : product.status,
      },
    });

    return order;
  });
};

export const getUserOrders = async (
  userId: string
) => {
  return prisma.order.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAllOrders = async () => {
  return prisma.order.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getOrderById = async (
  orderId: string
) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      isDeleted: false,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const updateOrderStatus = async (
  orderId: string,
  input: UpdateOrderStatusInput
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      isDeleted: false,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: input.status,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const deleteOrder = async (
  orderId: string,
  userId: string
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
      isDeleted: false,
    },
  });

  if (!order) {
    throw new Error(
      "Order not found or unauthorized"
    );
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const deleteOrderByAdmin = async (
  orderId: string
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      isDeleted: false,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      isDeleted: true,
    },
  });
};