import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client";
import { env } from "./env";

const pool = new Pool({
  connectionString: env.DATABASE_URL
});

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
