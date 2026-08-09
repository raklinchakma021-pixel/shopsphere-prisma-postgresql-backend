import { prisma } from "../../lib/prisma.js";
import { hashPassword } from "../../utils/password.js";

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export const getAllUsers = async () => {
  return prisma.user.findMany({
    where: {
      isDeleted: false,
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
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserById = async (userId: string) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
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
};

export const updateUser = async (
  userId: string,
  input: UpdateUserInput
) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  if (input.email && input.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (emailExists) {
      throw new Error("Email is already in use");
    }
  }

  const data: {
    name?: string;
    email?: string;
    password?: string;
  } = {};

  if (input.name) {
    data.name = input.name;
  }

  if (input.email) {
    data.email = input.email;
  }

  if (input.password) {
    data.password = await hashPassword(input.password);
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
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
};

export const deleteUser = async (userId: string) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isDeleted: true,
    },
  });
};