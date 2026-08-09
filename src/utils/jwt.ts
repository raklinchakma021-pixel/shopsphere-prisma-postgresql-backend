import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
};

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, getJwtSecret());

  if (
    typeof decoded === "string" ||
    !decoded.userId ||
    !decoded.role
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    userId: decoded.userId as string,
    role: decoded.role as string,
  };
};