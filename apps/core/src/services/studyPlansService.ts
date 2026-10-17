import { prisma } from "@/db/clients.js";
import type { Semester } from "@/generated/prisma/client.js";
import { Prisma } from "@/generated/prisma/client.js";

import type {
  AddPlanItemBodySchema,
  AddPlanItemsFromCartBodySchema,
  CreateStudyPlanBodySchema,
  UpdateCustomCreditTargetBodySchema,
  UpdateGradesBodySchema,
  UpdateStudyPlanBodySchema,
} from "@cugetreg/zod-schemas/study-plans";

import { LexoRankService } from "./lexorank.service.js";

// Chronological term order used to sort the grade page: year, then FIRST < SECOND < SUMMER
const SEMESTER_ORDER: Record<Semester, number> = {
  FIRST: 0,
  SECOND: 1,
  SUMMER: 2,
};

function toPlanItemResponse(
  item: Prisma.StudyPlanItemGetPayload<{ include: { courseInfo: true } }>,
) {
  return {
    id: item.id,
    courseNo: item.courseNo,
    yearOfStudy: item.yearOfStudy,
    semester: item.semester,
    categoryId: item.categoryId,
    requirementId: item.requirementId,
    isGraded: item.isGraded,
    expectedGrade: item.expectedGrade.toString(),
    itemOrder: item.itemOrder,
    course: {
      abbrName: item.courseInfo.abbrName,
      courseNameTh: item.courseInfo.courseNameTh,
      courseNameEn: item.courseInfo.courseNameEn,
      credit: item.courseInfo.credit.toString(),
    },
  };
}

async function assertPlanOwner(
  tx: Prisma.TransactionClient,
  userId: string,
  planId: string,
) {
  const plan = await tx.studyPlan.findUnique({ where: { id: planId } });
  if (!plan) {
    throw new Error("PLAN_NOT_FOUND");
  }
  if (plan.userId !== userId) {
    throw new Error("NOT_PLAN_OWNER");
  }
  return plan;
}

export const studyPlansService = {
  listStudyPlans: async (userId: string) => {
    return prisma.studyPlan.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  },

  // Creates the plan, and when a curriculum is chosen, copies its category list and
  // credit targets in as the plan's own (editable) PlanCategory/CustomCreditTarget rows.
  // Courses are not pre-filled — the student adds every course themselves.
  createStudyPlan: async (userId: string, data: CreateStudyPlanBodySchema) => {
    return prisma.$transaction(async (tx) => {
      const curriculum = data.curriculumId
        ? await tx.curriculum.findUnique({
            where: { id: data.curriculumId },
            include: {
              categories: true,
              creditTargets: true,
              requirements: true,
            },
          })
        : null;

      if (data.curriculumId && !curriculum) {
        throw new Error("CURRICULUM_NOT_FOUND");
      }

      const plan = await tx.studyPlan.create({
        data: {
          userId,
          name: data.name,
          curriculumId: data.curriculumId ?? null,
        },
      });

      if (curriculum) {
        const categoryIdMap = new Map<string, string>();
        for (const category of curriculum.categories) {
          const planCategory = await tx.planCategory.create({
            data: {
              planId: plan.id,
              name: category.name,
              curriculumCategoryId: category.id,
            },
          });
          categoryIdMap.set(category.id, planCategory.id);
        }

        for (const target of curriculum.creditTargets) {
          const categoryId = categoryIdMap.get(target.categoryId);
          if (!categoryId) {
            continue;
          }
          await tx.customCreditTarget.create({
            data: {
              planId: plan.id,
              yearOfStudy: target.yearOfStudy,
              semester: target.semester,
              categoryId,
              targetCredit: target.targetCredit,
            },
          });
        }

        // Pre-fill every required course so the student starts from the curriculum's
        // template instead of an empty plan. itemOrder follows the requirement list order.
        let order = LexoRankService.INITIAL_RANK;
        for (const requirement of curriculum.requirements) {
          const categoryId = categoryIdMap.get(requirement.categoryId);
          if (!categoryId) {
            continue;
          }
          try {
            await tx.studyPlanItem.create({
              data: {
                planId: plan.id,
                courseNo: requirement.courseNo,
                yearOfStudy: requirement.yearOfStudy,
                semester: requirement.semester,
                categoryId,
                requirementId: requirement.id,
                itemOrder: order,
              },
            });
            order = LexoRankService.getNextRank(order);
          } catch (e) {
            // A courseNo listed twice in the requirement list would collide with the
            // planId+courseNo uniqueness on StudyPlanItem — skip rather than fail creation.
            if (
              !(
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === "P2002"
              )
            ) {
              throw e;
            }
          }
        }
      }

      return plan;
    });
  },

  getStudyPlanDetail: async (userId: string, planId: string) => {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
      include: {
        categories: true,
        customCreditTargets: true,
        items: {
          orderBy: { itemOrder: "asc" },
          include: { courseInfo: true },
        },
      },
    });

    if (!plan) {
      throw new Error("PLAN_NOT_FOUND");
    }
    if (plan.userId !== userId) {
      throw new Error("NOT_PLAN_OWNER");
    }

    const { categories, customCreditTargets, items, ...planFields } = plan;

    return {
      plan: planFields,
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        curriculumCategoryId: c.curriculumCategoryId,
      })),
      creditTargets: customCreditTargets.map((t) => ({
        id: t.id,
        categoryId: t.categoryId,
        yearOfStudy: t.yearOfStudy,
        semester: t.semester,
        targetCredit: t.targetCredit,
      })),
      items: items.map(toPlanItemResponse),
    };
  },

  updateStudyPlanName: async (
    userId: string,
    planId: string,
    data: UpdateStudyPlanBodySchema,
  ) => {
    return prisma.$transaction(async (tx) => {
      await assertPlanOwner(tx, userId, planId);
      return tx.studyPlan.update({
        where: { id: planId },
        data: { name: data.name },
      });
    });
  },

  // Reveals one more regular term past the base 4 years / 8 terms (e.g. a student who
  // needs a 9th term). Purely a display-range counter — it does not create any items.
  addTerm: async (userId: string, planId: string) => {
    return prisma.$transaction(async (tx) => {
      await assertPlanOwner(tx, userId, planId);
      return tx.studyPlan.update({
        where: { id: planId },
        data: { extraTerms: { increment: 1 } },
      });
    });
  },

  // Marks this plan as the user's main plan — mirrors Cart's pin/isDefault pattern.
  setDefaultStudyPlan: async (userId: string, planId: string) => {
    await prisma.$transaction(async (tx) => {
      await assertPlanOwner(tx, userId, planId);
      await tx.studyPlan.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
      await tx.studyPlan.update({
        where: { id: planId },
        data: { isDefault: true },
      });
    });
  },

  updateCustomCreditTarget: async (
    userId: string,
    planId: string,
    creditTargetId: string,
    data: UpdateCustomCreditTargetBodySchema,
  ) => {
    return prisma.$transaction(async (tx) => {
      await assertPlanOwner(tx, userId, planId);
      const target = await tx.customCreditTarget.findUnique({
        where: { id: creditTargetId },
      });
      if (!target || target.planId !== planId) {
        throw new Error("CREDIT_TARGET_NOT_FOUND");
      }
      return tx.customCreditTarget.update({
        where: { id: creditTargetId },
        data: { targetCredit: data.targetCredit },
      });
    });
  },

  addPlanItem: async (
    userId: string,
    planId: string,
    data: AddPlanItemBodySchema,
  ) => {
    return prisma.$transaction(async (tx) => {
      const plan = await assertPlanOwner(tx, userId, planId);

      const courseInfo = await tx.courseInfo.findUnique({
        where: { courseNo: data.courseNo },
      });
      if (!courseInfo) {
        throw new Error("COURSE_NOT_FOUND");
      }

      const category = await tx.planCategory.findUnique({
        where: { id: data.categoryId },
      });
      if (!category || category.planId !== planId) {
        throw new Error("CATEGORY_NOT_FOUND");
      }

      // Best-effort link to the official requirement, if this plan has a curriculum and
      // this exact course/year/semester happens to be on its required list.
      const requirement = plan.curriculumId
        ? await tx.curriculumRequirement.findFirst({
            where: {
              curriculumId: plan.curriculumId,
              yearOfStudy: data.yearOfStudy,
              semester: data.semester,
              courseNo: data.courseNo,
            },
          })
        : null;

      try {
        const item = await tx.studyPlanItem.create({
          data: {
            planId,
            courseNo: data.courseNo,
            yearOfStudy: data.yearOfStudy,
            semester: data.semester,
            categoryId: data.categoryId,
            requirementId: requirement?.id ?? null,
          },
          include: { courseInfo: true },
        });
        return toPlanItemResponse(item);
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new Error("COURSE_ALREADY_IN_PLAN");
        }
        throw e;
      }
    });
  },

  // Candidates for "add from schedule" — the user's cart items across every one of their
  // carts whose semester matches, regardless of academic year, excluding courses already
  // placed anywhere in this plan.
  listCartCandidates: async (
    userId: string,
    planId: string,
    semester: Semester,
  ) => {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
      include: { items: { select: { courseNo: true } } },
    });
    if (!plan) {
      throw new Error("PLAN_NOT_FOUND");
    }
    if (plan.userId !== userId) {
      throw new Error("NOT_PLAN_OWNER");
    }

    const existingCourseNos = new Set(plan.items.map((i) => i.courseNo));

    const cartItems = await prisma.cartItem.findMany({
      where: {
        cart: { userId, semester },
      },
      include: { cart: true, courseInfo: true },
    });

    return cartItems
      .filter((item) => !existingCourseNos.has(item.courseNo))
      .map((item) => ({
        cartItemId: item.id,
        cartId: item.cartId,
        cartName: item.cart.name,
        academicYear: item.cart.academicYear,
        courseNo: item.courseNo,
        abbrName: item.courseInfo.abbrName,
        courseNameTh: item.courseInfo.courseNameTh,
        courseNameEn: item.courseInfo.courseNameEn,
        credit: item.courseInfo.credit.toString(),
      }));
  },

  addPlanItemsFromCart: async (
    userId: string,
    planId: string,
    data: AddPlanItemsFromCartBodySchema,
  ) => {
    return prisma.$transaction(async (tx) => {
      const plan = await assertPlanOwner(tx, userId, planId);

      const category = await tx.planCategory.findUnique({
        where: { id: data.categoryId },
      });
      if (!category || category.planId !== planId) {
        throw new Error("CATEGORY_NOT_FOUND");
      }

      // Only pull items from carts the caller actually owns, matched by semester only —
      // the academic year of the real timetable doesn't need to match the plan's term.
      const cartItems = await tx.cartItem.findMany({
        where: {
          id: { in: data.cartItemIds },
          cart: { userId, semester: data.semester },
        },
        include: { courseInfo: true },
      });

      const existingItems = await tx.studyPlanItem.findMany({
        where: { planId },
        select: { courseNo: true },
      });
      const existingCourseNos = new Set(existingItems.map((i) => i.courseNo));

      const added: ReturnType<typeof toPlanItemResponse>[] = [];
      const skipped: { courseNo: string; reason: "ALREADY_IN_PLAN" }[] = [];

      for (const cartItem of cartItems) {
        if (existingCourseNos.has(cartItem.courseNo)) {
          skipped.push({
            courseNo: cartItem.courseNo,
            reason: "ALREADY_IN_PLAN",
          });
          continue;
        }

        const requirement = plan.curriculumId
          ? await tx.curriculumRequirement.findFirst({
              where: {
                curriculumId: plan.curriculumId,
                yearOfStudy: data.yearOfStudy,
                semester: data.semester,
                courseNo: cartItem.courseNo,
              },
            })
          : null;

        const created = await tx.studyPlanItem.create({
          data: {
            planId,
            courseNo: cartItem.courseNo,
            yearOfStudy: data.yearOfStudy,
            semester: data.semester,
            categoryId: data.categoryId,
            requirementId: requirement?.id ?? null,
          },
          include: { courseInfo: true },
        });

        existingCourseNos.add(cartItem.courseNo);
        added.push(toPlanItemResponse(created));
      }

      return { added, skipped };
    });
  },

  removePlanItem: async (userId: string, planId: string, itemId: string) => {
    await prisma.$transaction(async (tx) => {
      await assertPlanOwner(tx, userId, planId);
      const item = await tx.studyPlanItem.findUnique({
        where: { id: itemId },
      });
      if (!item || item.planId !== planId) {
        throw new Error("ITEM_NOT_FOUND");
      }
      await tx.studyPlanItem.delete({ where: { id: itemId } });
    });
  },

  getStudyPlanGrades: async (userId: string, planId: string) => {
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
      include: { items: { include: { courseInfo: true } } },
    });
    if (!plan) {
      throw new Error("PLAN_NOT_FOUND");
    }
    if (plan.userId !== userId) {
      throw new Error("NOT_PLAN_OWNER");
    }

    const termKey = (y: number, s: Semester) => `${y}|${s}`;
    const termMap = new Map<string, typeof plan.items>();
    for (const item of plan.items) {
      const key = termKey(item.yearOfStudy, item.semester);
      const list = termMap.get(key) ?? [];
      list.push(item);
      termMap.set(key, list);
    }

    const terms = Array.from(termMap.values())
      .map((items) => {
        const first = items[0]!;
        const termCredit = items.reduce(
          (sum, i) => sum + Number(i.courseInfo.credit),
          0,
        );
        const gradedItems = items.filter((i) => i.isGraded);
        const gradedCredit = gradedItems.reduce(
          (sum, i) => sum + Number(i.courseInfo.credit),
          0,
        );
        const gradedPoints = gradedItems.reduce(
          (sum, i) =>
            sum + Number(i.courseInfo.credit) * Number(i.expectedGrade),
          0,
        );

        return {
          yearOfStudy: first.yearOfStudy,
          semester: first.semester,
          items: items.map((i) => ({
            id: i.id,
            courseNo: i.courseNo,
            courseNameTh: i.courseInfo.courseNameTh,
            courseNameEn: i.courseInfo.courseNameEn,
            credit: i.courseInfo.credit.toString(),
            isGraded: i.isGraded,
            expectedGrade: i.expectedGrade.toString(),
          })),
          termCredit: termCredit.toFixed(1),
          termGpa:
            gradedCredit > 0
              ? Number((gradedPoints / gradedCredit).toFixed(2))
              : null,
        };
      })
      .sort((a, b) => {
        if (a.yearOfStudy !== b.yearOfStudy) {
          return a.yearOfStudy - b.yearOfStudy;
        }
        return SEMESTER_ORDER[a.semester] - SEMESTER_ORDER[b.semester];
      });

    const totalCredit = plan.items.reduce(
      (sum, i) => sum + Number(i.courseInfo.credit),
      0,
    );
    const gradedItems = plan.items.filter((i) => i.isGraded);
    const totalGradedCredit = gradedItems.reduce(
      (sum, i) => sum + Number(i.courseInfo.credit),
      0,
    );
    const totalGradedPoints = gradedItems.reduce(
      (sum, i) => sum + Number(i.courseInfo.credit) * Number(i.expectedGrade),
      0,
    );

    return {
      terms,
      totalCredit: totalCredit.toFixed(1),
      totalGradedCredit: totalGradedCredit.toFixed(1),
      gpax:
        totalGradedCredit > 0
          ? Number((totalGradedPoints / totalGradedCredit).toFixed(2))
          : null,
    };
  },

  // Called every ~10s from the grade page while the student is editing — upserts whichever
  // rows changed since the last call in one round trip.
  updateGrades: async (
    userId: string,
    planId: string,
    data: UpdateGradesBodySchema,
  ) => {
    return prisma
      .$transaction(async (tx) => {
        await assertPlanOwner(tx, userId, planId);

        const itemIds = data.items.map((i) => i.itemId);
        const existing = await tx.studyPlanItem.findMany({
          where: { id: { in: itemIds }, planId },
          select: { id: true },
        });
        if (existing.length !== itemIds.length) {
          throw new Error("ITEM_NOT_FOUND");
        }

        await Promise.all(
          data.items.map((i) =>
            tx.studyPlanItem.update({
              where: { id: i.itemId },
              data: { isGraded: i.isGraded, expectedGrade: i.expectedGrade },
            }),
          ),
        );

        return tx.studyPlanItem.findMany({
          where: { id: { in: itemIds } },
          include: { courseInfo: true },
        });
      })
      .then((items) => items.map(toPlanItemResponse));
  },
};
