import { PrismaClient } from "../src/generated/prisma/client.js";
import * as fs from "fs";
import { mapReviewStatus, mapSemester, mapStudyProgram } from "./enumMapper.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function migrate() {
  const rawData = fs.readFileSync("reviews.json", "utf-8");
  const reviewsData = JSON.parse(rawData);

  console.log("Starting Migrate Import");

  for (const item of reviewsData) {
    try {
      await prisma.review.create({
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
      });

      console.log(`Migrated review: ${item._id.$oid}`);
    } catch (error) {
      console.error(
        `Failed to migrated review ${item._id.$oid}:`,
        (error as Error).message
      );
    }
  }

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
