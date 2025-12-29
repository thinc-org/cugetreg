import * as fs from "fs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { mapSemester, mapStudyProgram, mapVisible } from "./enumMapper.js";
import "dotenv/config";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
async function migrate() {
  const rawData = fs.readFileSync("users.json", "utf-8");
  const usersData = JSON.parse(rawData);

  console.log(`Starting migration for ${usersData.length} users`);

  for (const mongoUser of usersData) {
    try {
      const user = await prisma.user.create({
        data: {
          id: mongoUser._id.$oid,
          email: mongoUser.email,
          name: mongoUser.name,
          googleId: mongoUser.google.googleId,
          image: null,
          faculty: null,
          department: null,
        },
      });

      if (mongoUser.courseCart && mongoUser.courseCart.cartContent.length > 0) {
        const cartGroups = mongoUser.courseCart.cartContent.reduce(
          (acc: any, item: any) => {
            const key = `${item.academicYear}-${item.semester}-${item.studyProgram}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
          },
          {}
        );

        for (const key in cartGroups) {
          const items = cartGroups[key];
          const firstItem = items[0];

          const cart = await prisma.cart.create({
            data: {
              userId: user.id,
              academicYear: parseInt(firstItem.academicYear),
              semester: mapSemester(firstItem.semester),
              studyProgram: mapStudyProgram(firstItem.studyProgram),
              name: "My Schedule",
              visible: mapVisible("PRIVATE"),
              isDefault: true,
              cartOrder: 0,
            },
          });

          for (let i = 0; i < items.length; i++) {
            const item = items[i];

            await prisma.cartItem.create({
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
            });
          }
        }
      }
      console.log(`Migrated: ${user.name}`);
    } catch (error) {
      console.error(`Failed to migrate user ${mongoUser.email}:`, error);
    }
  }
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
