import dotenv from "dotenv";
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import * as fs from "fs";
import {
  mapReviewStatus,
  mapSemester,
  mapStudyProgram,
} from "../src/utils/enumMapper.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Effect, Console } from "effect";

const adapter = new PrismaPg({
  connectionString:
    "postgresql://admin:cugetreg@localhost:5432/cugetreg?schema=public",
  max: 10,
});
const prisma = new PrismaClient({ adapter });

const safeParseJSON = <T>(jsonString: string) =>
  Effect.try({
    try: () => JSON.parse(jsonString) as T,
    catch: (e) => new Error(`JSON parsing failed: ${e}`),
  });

interface MongoId {
  $oid: string;
}

type ReviewStatus = "APPROVED" | "REJECTED" | "PENDING";

interface Review {
  _id: MongoId;
  academicYear: string;
  content: string;
  courseNo: string;
  interactions: any[]; // Interaction how it look like ??
  ownerId: MongoId;
  rating: number;
  semester: string;
  status: ReviewStatus;
  studyProgram: string;
  rejectionReason?: string | null;
  updatedAt?: { $date: string };
  createdAt?: { $date: string };
}

const migrateReview = (item: Review) =>
  Effect.gen(function* (_) {
    yield* _(
      Effect.tryPromise({
        try: () =>
          prisma.review.create({
            data: {
              id: item._id.$oid,
              content: item.content,
              rating: item.rating,
              courseNo: item.courseNo,
              academicYear: parseInt(item.academicYear),
              semester: mapSemester(item.semester),
              studyProgram: mapStudyProgram(item.studyProgram),
              status: mapReviewStatus(item.status),
              rejectionReason: item.rejectionReason || null,
              user: {
                connect: { id: item.ownerId.$oid },
              },
            },
          }),
        catch: (e) => new Error(`Prisma Review Error [${item._id.$oid}]: ${e}`),
      })
    );

    yield* _(Console.log(`Migrated review: ${item._id.$oid}`));
  }).pipe(
    Effect.catchAll((err) =>
      Console.error(`Failed to migrate review: ${err.message}`)
    )
  );

async function migrate() {
  const rawData = fs.readFileSync("reviews.json", "utf-8");
  const reviewsData = Effect.runSync(safeParseJSON<Review[]>(rawData));

  console.log("Starting Migrate Import");

  const migrationReviewsProgram = Effect.forEach(
    reviewsData,
    (item) => migrateReview(item),
    { discard: true, concurrency: 5 }
  );

  await Effect.runPromise(migrationReviewsProgram);

  console.log("Migrate Completed");
}

migrate()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
