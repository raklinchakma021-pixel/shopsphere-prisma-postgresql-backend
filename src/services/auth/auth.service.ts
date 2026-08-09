import { prisma } from "../../lib/prisma.js";
import {
  comparePassword,
  hashPassword,
} from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (input: RegisterInput) => {
  const { name, email, password } = input;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.isDeleted) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};