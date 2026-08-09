import { prisma } from "../../lib/prisma.js";

interface CreateCategoryInput {
  name: string;
  description?: string;
}

interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

export const createCategory = async (
  input: CreateCategoryInput
) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: input.name,
    },
  });

  if (existingCategory && !existingCategory.isDeleted) {
    throw new Error("Category already exists");
  }

  return prisma.category.create({
    data: {
      name: input.name,
      description: input.description,
    },
  });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCategoryById = async (
  categoryId: string
) => {
  return prisma.category.findFirst({
    where: {
      id: categoryId,
      isDeleted: false,
    },
    include: {
      products: {
        where: {
          isDeleted: false,
        },
      },
    },
  });
};

export const updateCategory = async (
  categoryId: string,
  input: UpdateCategoryInput
) => {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (input.name && input.name !== category.name) {
    const existingCategory =
      await prisma.category.findUnique({
        where: {
          name: input.name,
        },
      });

    if (existingCategory) {
      throw new Error("Category name already exists");
    }
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: input,
  });
};

export const deleteCategory = async (
  categoryId: string
) => {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      isDeleted: true,
    },
  });
};