import * as fs from "fs";
import { Console, Effect } from "effect";
import type { MongoUser } from "./migrate_interface.js";
import { migrateUser, safeFsJsonRead } from "./migrate_service.js";
export const runUserMigration = Effect.gen(function* () {
  const usersData = yield* safeFsJsonRead<MongoUser[]>("users.json");

  Console.log(`Starting migration for ${usersData.length} users`);

  const migrationProgram = yield* Effect.forEach(
    usersData,
    (data) => migrateUser(data),
    {
      concurrency: 100,
      discard: true,
    }
  );
});
