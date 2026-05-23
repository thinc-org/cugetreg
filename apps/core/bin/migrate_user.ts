import cliProgress from "cli-progress";

import type { MongoUser } from "./migrate_interface.js";
import { migrateUser, runConcurrent, safeFsJsonRead } from "./migrate_service.js";

const CONCURRENCY = 20;

export async function runUserMigration() {
  const usersData = safeFsJsonRead<MongoUser[]>("users.json");

  const bar = new cliProgress.SingleBar(
    { format: "  Users    [{bar}] {value}/{total} ({percentage}%)" },
    cliProgress.Presets.shades_classic,
  );
  bar.start(usersData.length, 0);

  await runConcurrent(usersData, CONCURRENCY, async (data) => {
    await migrateUser(data);
    bar.increment();
  });

  bar.stop();
}
