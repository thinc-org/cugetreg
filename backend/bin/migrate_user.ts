import "dotenv/config";
import * as fs from "fs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import {
  mapSemester,
  mapStudyProgram,
  mapVisible,
} from "../src/utils/enumMapper.js";
import * as R from "ramda";
import { Effect, Console } from "effect";

const pool = new pg.Pool({
  connectionString:
    "postgresql://admin:cugetreg@localhost:5432/cugetreg?schema=public",
  max: 10,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const safeParseJSON = <T>(jsonString: string) =>
  Effect.try({
    try: () => JSON.parse(jsonString) as T,
    catch: (e) => new Error(`JSON parsing failed: ${e}`),
  });

interface MongoId {
  $oid: string;
}

interface GoogleInfo {
  googleId: string;
  hasMigratedGDrive: boolean;
  _id?: MongoId;
}

interface MongoCartItem {
  studyProgram: string;
  academicYear: string;
  semester: string;
  courseNo: string;
  selectedSectionNo: string;
  isHidden: boolean;
  color: string;
  _id: MongoId;
}

interface MongoCourseCart {
  cartContent: MongoCartItem[];
  _id?: MongoId;
}

interface MongoUser {
  _id: MongoId;
  __v: number;
  email: string;
  google: GoogleInfo;
  name: string;
  courseCart?: MongoCourseCart;
}

const migrateUser = (mongoUser: MongoUser) =>
  Effect.gen(function* (_) {
    const user = yield* _(
      Effect.tryPromise({
        try: () =>
          prisma.user.create({
            data: {
              id: mongoUser._id.$oid,
              email: mongoUser.email,
              name: mongoUser.name,
              googleId: mongoUser.google.googleId,
              image: null,
              faculty: null,
              department: null,
            },
          }),
        catch: (e) => new Error(`User Creation Error: ${e}`),
      })
    );

    if (mongoUser.courseCart?.cartContent?.length) {
      const cartGroups = R.groupBy(
        (item: MongoCartItem) =>
          `${item.academicYear}-${item.semester}-${item.studyProgram}`,
        mongoUser.courseCart.cartContent
      );

      for (const groupKey in cartGroups) {
        const items = cartGroups[groupKey]!;
        const first = items[0];

        const cart = yield* _(
          Effect.tryPromise({
            try: () =>
              prisma.cart.create({
                data: {
                  userId: user.id,
                  academicYear: parseInt(first.academicYear),
                  semester: mapSemester(first.semester),
                  studyProgram: mapStudyProgram(first.studyProgram),
                  name: "My Schedule",
                  visible: mapVisible("PRIVATE"),
                  isDefault: true,
                  cartOrder: 0,
                },
              }),
            catch: (e) => new Error(`Cart Creation Error: ${e}`),
          })
        );

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          yield* _(
            Effect.tryPromise({
              try: () =>
                prisma.cartItem.create({
                  data: {
                    cartId: cart.id,
                    courseNo: item.courseNo,
                    sectionNo: parseInt(item.selectedSectionNo),
                    color: item.color,
                    hidden: item.isHidden || false,
                    cartOrder: i,
                    isGraded: false,
                    expectedGrade: 0,
                  },
                }),
              catch: (e) => new Error(`CartItem Creation Error: ${e}`),
            })
          );
        }
      }
    }

    yield* _(Console.log(`Successfully migrated: ${user.name}`));
  }).pipe(
    Effect.catchAll((err) =>
      Console.error(`Skipping ${mongoUser.email}: ${err.message}`)
    )
  );

async function migrate() {
  const rawData = fs.readFileSync("users.json", "utf-8");
  const usersData = Effect.runSync(safeParseJSON<MongoUser[]>(rawData));

  console.log(`Starting migration for ${usersData.length} users`);

  const migrationProgram = Effect.forEach(
    usersData,
    (data) => migrateUser(data),
    {
      concurrency: 5,
      discard: true,
    }
  );

  await Effect.runPromise(migrationProgram);
}

migrate()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Migration completed.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
