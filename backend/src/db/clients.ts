import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { env } from "../env.js";
import {
  PrismaClientService,
  PrismaService,
} from "../generated/prisma-effect/index.js";
import { Layer } from "effect";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

export const PrismaLive = PrismaService.Default.pipe(
  Layer.provide(Layer.succeed(PrismaClientService, prisma))
);
