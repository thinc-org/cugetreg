import * as fs from "fs";
import { Effect } from "effect";
import type { MongoUser } from "./migrate_interface.js";
import { migrateUser, safeFsJsonRead } from "./migrate_service.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

export const runUserMigration = Effect.gen(function* () {
  const usersData = yield* safeFsJsonRead<MongoUser[]>("users.json");

  const adapter = new PrismaPg({
    connectionString:
      "postgresql://admin:cugetreg@localhost:5432/cugetreg?schema=public",
    max: 10,
  });
  const prisma = new PrismaClient({ adapter });

  console.log(`Starting migration for ${usersData.length} users`);

  const migrationProgram = yield* Effect.forEach(
    usersData,
    (data) => migrateUser(data),
    {
      concurrency: 50,
      discard: true,
    }
  );
});
