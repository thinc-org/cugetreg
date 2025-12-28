import { Hono } from "hono";
import { prisma } from "../db/clients.js";
import { zValidator } from "@hono/zod-validator";
import {
  createCartBodySchema,
  listCartsQuerySchema,
  updateCartBodySchema,
} from "../zod_schemas/carts.schema.js";

const carts = new Hono();

// Manage Timetable

// 3.1. List timetables for current user
carts.get("/", zValidator("query", listCartsQuerySchema), async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  const { academicYear, semester, studyProgram } = c.req.valid("query");
  try {
    const userCarts = await prisma.cart.findMany({
      where: {
        userId: userId,
        academicYear: academicYear,
        semester: semester,
        studyProgram: studyProgram,
      },
    });
    return c.json({ data: userCarts });
  } catch (err) {
    console.error("Fetch Carts Error:", err);
    return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
  }
});

// 3.2. Create new timetable (cart)
carts.post("/", zValidator("json", createCartBodySchema), async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  const validatedData = c.req.valid("json");
  c.req.valid("json");
  try {
    // Sequence of dependent operation
    const newCart = await prisma.$transaction(async (tx) => {
      // Set other isDefault
      if (validatedData.isDefault) {
        await tx.cart.updateMany({
          where: {
            userId: userId,
            academicYear: validatedData.academicYear,
            semester: validatedData.semester,
            studyProgram: validatedData.studyProgram,
            isDefault: true,
          },
          data: { isDefault: false },
        });
      }
      // Find max of cart_order
      const aggregate = await tx.cart.aggregate({
        where: {
          userId,
          academicYear: validatedData.academicYear,
          semester: validatedData.semester,
          studyProgram: validatedData.studyProgram,
        },
        _max: { cartOrder: true },
      });
      // When aggregate._max.cartOrder === null , nextCartOrder = 0
      const nextCartOrder = (aggregate._max.cartOrder ?? -1) + 1;

      return await tx.cart.create({
        data: {
          userId,
          cartOrder: nextCartOrder,
          ...validatedData,
        },
      });
    });
    return c.json({ data: newCart }, 201);
  } catch (err) {
    console.error("Fetch Carts Error:", err);
    return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
  }
});

// 3.3. Edit timetable (cart) (Rename, Set default, share/stop share, Ordering)
carts.patch("/:cartId", zValidator("json", updateCartBodySchema), async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.id;
  const cartId = c.req.param("cartId");
  const updatedData = c.req.valid("json");
  try {
    const updatedCart = await prisma.$transaction(async (tx) => {
      // Find current cart
      const targetCart = await tx.cart.findFirst({
        where: { id: cartId },
      });

      if (!targetCart) {
        throw new Error("CART_NOT_FOUND");
      }
      if (targetCart.userId !== userId) throw new Error("NOT_CART_OWNER");

      // Set other isDefault
      if (updatedData.isDefault === true) {
        await tx.cart.updateMany({
          where: {
            userId,
            academicYear: targetCart.academicYear,
            semester: targetCart.semester,
            studyProgram: targetCart.studyProgram,
            isDefault: true,
          },
          data: { isDefault: false },
        });
      }

      // Reorder other cartOrder -> Please review this code!
      const newOrder = updatedData.cartOrder;
      const oldOrder = targetCart.cartOrder;
      if (newOrder !== undefined && newOrder !== oldOrder) {
        const isMoveDown = oldOrder < newOrder;
        await tx.cart.updateMany({
          where: {
            userId,
            academicYear: targetCart.academicYear,
            semester: targetCart.semester,
            studyProgram: targetCart.studyProgram,
            cartOrder: isMoveDown
              ? { gt: oldOrder, lte: newOrder }
              : { gte: newOrder, lt: oldOrder },
          },
          data: {
            cartOrder: {
              [isMoveDown ? "decrement" : "increment"]: 1,
            },
          },
        });
      }

      return await tx.cart.update({
        where: { id: cartId },
        data: updatedData,
      });
    });
    return c.json({ data: updatedCart }, 200);
  } catch (err: any) {
    console.error("Fetch Carts Error:", err);
    if (err.message === "CART_NOT_FOUND") {
      return c.json({ error: "CART_NOT_FOUND" }, 404);
    } else if (err.message === "NOT_CART_OWNER") {
      return c.json({ error: "NOT_CART_OWNER" }, 403);
    } else {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  }
});

// 3.4. Delete timetable (cart)
carts.delete("/:cartId", async (c) => {
  const userId = c.get("jwtPayload").id;
  const cartId = c.req.param("cartId");
  try {
    await prisma.$transaction(async (tx) => {
      const targetCart = await tx.cart.findUnique({
        where: { id: cartId },
      });
      if (!targetCart) throw new Error("CART_NOT_FOUND");
      if (targetCart.userId !== userId) throw new Error("NOT_CART_OWNER");

      await tx.cart.delete({
        where: { id: cartId },
      });
      // Reorder cartOrder -> Please review this code
      await tx.cart.updateMany({
        where: {
          userId,
          academicYear: targetCart.academicYear,
          semester: targetCart.semester,
          studyProgram: targetCart.studyProgram,
          cartOrder: { gt: targetCart.cartOrder },
        },
        data: {
          cartOrder: { decrement: 1 },
        },
      });

      // Case deletedCart is default assign least cartOrder to be next default
      if (targetCart.isDefault) {
        const nextDefaultCart = await tx.cart.findFirst({
          where: {
            userId,
            academicYear: targetCart.academicYear,
            semester: targetCart.semester,
            studyProgram: targetCart.studyProgram,
          },
          orderBy: { cartOrder: "asc" },
        });
        if (nextDefaultCart) {
          await tx.cart.update({
            where: { id: nextDefaultCart.id },
            data: { isDefault: true },
          });
        }
      }
    });
    return c.body(null, 204);
  } catch (err: any) {
    console.error("Fetch Carts Error:", err);
    if (err.message === "CART_NOT_FOUND") {
      return c.json({ error: "CART_NOT_FOUND" }, 404);
    } else if (err.message === "NOT_CART_OWNER") {
      return c.json({ error: "NOT_CART_OWNER" }, 403);
    } else {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  }
});

// 3.5. Get timetable details (courses, credits, ect.)
carts.get("/:cartId", async (c) => {
  const userId = c.get("jwtPayload").id;
  const cartId = c.req.param("cartId");

  try {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            courseN: {
              include: {
                courses: {
                  include: {
                    sections: {
                      include: { classes: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) return c.json({ error: "CART_NOT_FOUND" }, 404);
    if (cart.userId !== userId) return c.json({ error: "NOT_CART_OWNER" }, 403);

    const itemsResponse: any[] = [];
    const classesSchedule: any[] = [];
    const examsSchedule: any[] = [];

    let totalCredits = 0;
    let totalVisibleCredits = 0;
    let totalGradedCredits = 0;
    let totalPoints = 0;

    cart.items.forEach((item) => {
      const info = item.courseN;
      const creditValue = Number(info.credit);

      const courseData = info.courses.find(
        (course) =>
          course.academicYear === cart.academicYear &&
          course.semester === cart.semester &&
          course.studyProgram === cart.studyProgram
      );

      const sectionData = courseData?.sections.find(
        (sec) => sec.sectionNo === item.sectionNo
      );

      // Calculate Pre-Summary
      totalCredits += creditValue;
      if (!item.hidden) totalVisibleCredits += creditValue;
      if (item.isGraded) {
        totalGradedCredits += creditValue;
        totalPoints += Number(item.expectedGrade) * creditValue;
      }

      // Format Items
      itemsResponse.push({
        id: item.id,
        courseNo: item.courseNo,
        sectionNo: item.sectionNo,
        color: item.color,
        hidden: item.hidden,
        cartOrder: item.cartOrder,
        isGraded: item.isGraded,
        expectedGrade: item.expectedGrade.toString(),
        course: {
          courseNameTh: info.courseNameTh,
          courseNameEn: info.courseNameEn,
          credit: info.credit.toString(),
        },
        section: sectionData
          ? {
              closed: sectionData.closed,
              regis: sectionData.regis,
              max: sectionData.max,
              note: sectionData.note,
            }
          : null,
      });

      // Format Classes Schedule
      sectionData?.classes.forEach((cls) => {
        classesSchedule.push({
          cartItemId: item.id,
          courseNo: item.courseNo,
          sectionNo: item.sectionNo,
          type: cls.type,
          dayOfWeek: cls.dayOfWeek,
          periodStart: cls.periodStart,
          periodEnd: cls.periodEnd,
          building: cls.building,
          room: cls.room,
          professors: cls.professors.split(","),
        });
      });

      // Format Exams Schedule (Midterm/Final)
      if (courseData?.midtermStart) {
        examsSchedule.push({
          cartItemId: item.id,
          courseNo: item.courseNo,
          type: "MIDTERM",
          start: courseData.midtermStart.toISOString(),
          end: courseData.midtermEnd?.toISOString(),
        });
      }
      if (courseData?.finalStart) {
        examsSchedule.push({
          cartItemId: item.id,
          courseNo: item.courseNo,
          type: "FINAL",
          start: courseData.finalStart.toISOString(),
          end: courseData.finalEnd?.toISOString(),
        });
      }
    });

    // Find class conflict -> Please review this logic
    const classConflicts: any[] = [];
    const timeToMin = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    for (let i = 0; i < classesSchedule.length; i++) {
      for (let j = i + 1; j < classesSchedule.length; j++) {
        const a = classesSchedule[i];
        const b = classesSchedule[j];
        if (a.dayOfWeek === b.dayOfWeek) {
          const startA = timeToMin(a.periodStart);
          const endA = timeToMin(a.periodEnd);
          const startB = timeToMin(b.periodStart);
          const endB = timeToMin(b.periodEnd);
          if (startA < endB && startB < endA) {
            classConflicts.push({
              type: "TIME_OVERLAP",
              itemIds: [a.cartItemId, b.cartItemId],
              dayOfWeek: a.dayOfWeek,
              periodStart: a.periodStart,
              periodEnd: a.periodEnd,
            });
          }
        }
      }
    }

    // Find Exam Conflicts -> Please review this logic
    const examConflicts: any[] = [];
    for (let i = 0; i < examsSchedule.length; i++) {
      for (let j = i + 1; j < examsSchedule.length; j++) {
        const examA = examsSchedule[i];
        const examB = examsSchedule[j];

        // Garuntee if startA exist then endA exist
        const startA = new Date(examA.start).getTime();
        const endA = new Date(examA.end).getTime();
        const startB = new Date(examB.start).getTime();
        const endB = new Date(examB.end).getTime();

        if (startA < endB && startB < endA) {
          examConflicts.push({
            type: "EXAM_OVERLAP",
            itemIds: [examA.cartItemId, examB.cartItemId],
            start: startA > startB ? examA.start : examB.start,
            end: endA < endB ? examA.end : examB.end,
          });
        }
      }
    }

    return c.json({
      data: {
        cart: {
          id: cart.id,
          name: cart.name,
          studyProgram: cart.studyProgram,
          academicYear: cart.academicYear,
          semester: cart.semester,
          visible: cart.visible === "PUBLIC" ? "PUB" : "PRIV",
          isDefault: cart.isDefault,
          cartOrder: cart.cartOrder,
          items: itemsResponse,
        },
        summary: {
          totalCredits: totalCredits.toFixed(1),
          totalVisibleCredits: totalVisibleCredits.toFixed(1),
          totalGradedCredits: totalGradedCredits.toFixed(1),
          expectedGPA:
            totalGradedCredits > 0
              ? Number((totalPoints / totalGradedCredits).toFixed(2))
              : 0,
        },
        conflicts: {
          classConflicts: classConflicts,
          examConflicts: examConflicts,
        },
        schedule: {
          classes: classesSchedule,
          exams: examsSchedule,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
  }
});

// Manange Course in Timetable

carts.post("/:cartId/items", async (c) => {
  return c.json({ message: "3.6. Add course to timetable" });
});

carts.patch("/:itemId", async (c) => {
  return c.json({ message: "3.7. Update/edit course in timetable" });
});

carts.delete("/:itemId", async (c) => {
  return c.json({ message: "3.8. Remove course from timetable" });
});

export default carts;
