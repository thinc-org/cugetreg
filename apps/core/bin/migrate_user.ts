import type { MongoUser } from "./migrate_interface.js";
import { migrateUser, safeFsJsonRead } from "./migrate_service.js";

export async function runUserMigration() {
  const usersData = safeFsJsonRead<MongoUser[]>("users.json");

  console.log(`Starting migration for ${usersData.length} users`);

  await Promise.all(usersData.map((data) => migrateUser(data)));
}
