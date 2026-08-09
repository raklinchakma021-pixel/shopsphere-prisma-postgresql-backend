import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
  max: 5,
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});