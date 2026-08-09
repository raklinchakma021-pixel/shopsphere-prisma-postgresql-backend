import { prisma } from "../../lib/prisma.js";

interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  categoryId: string;
}

interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  categoryId?: string;
}

export const createProduct = async (
  input: CreateProductInput
) => {
  const category = await prisma.category.findFirst({
    where: {
      id: input.categoryId,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  let status = input.status;

  if (input.stock === 0) {
    status = "OUT_OF_STOCK";
  }

  return prisma.product.create({
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      status,
      categoryId: input.categoryId,
    },
    include: {
      category: true,
    },
  });
};

export const getAllProducts = async () => {
  return prisma.product.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (
  productId: string
) => {
  return prisma.product.findFirst({
    where: {
      id: productId,
      isDeleted: false,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      reviews: {
        where: {
          isDeleted: false,
          status: "ACTIVE",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

export const updateProduct = async (
  productId: string,
  input: UpdateProductInput
) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (input.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: input.categoryId,
        isDeleted: false,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const data: UpdateProductInput = {
    ...input,
  };

  if (input.stock === 0) {
    data.status = "OUT_OF_STOCK";
  }

  return prisma.product.update({
    where: {
      id: productId,
    },
    data,
    include: {
      category: true,
    },
  });
};

export const deleteProduct = async (
  productId: string
) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      isDeleted: true,
    },
  });
};