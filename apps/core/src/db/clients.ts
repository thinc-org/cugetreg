import "dotenv/config";

import { env } from "@/env.js";
import { PrismaClient } from "@/generated/prisma/client.js";

import { PrismaPg } from "@prisma/adapter-pg";

// Shared Prisma singleton — import `prisma` from here instead of creating new clients
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
