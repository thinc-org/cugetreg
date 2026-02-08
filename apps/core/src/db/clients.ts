import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Layer } from "effect";

import { env } from "../env.js";
import { PrismaClient } from "../generated/prisma/client.js";
import {
  PrismaClientService,
  PrismaService,
} from "../generated/prisma-effect/index.js";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

export const PrismaLive = PrismaService.Default.pipe(
  Layer.provide(Layer.succeed(PrismaClientService, prisma)),
);