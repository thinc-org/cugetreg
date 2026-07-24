import { prisma } from "@/db/clients.js";
import type { Prisma } from "@/generated/prisma/client.js";
import { ReviewStatus, VoteType } from "@/generated/prisma/enums.js";
import { getCourseList } from "@/generated/prisma/sql.js";
import { mapDayOfWeek } from "@/utils/enumMapper.js";

import type { GetCourseQuerySchema } from "@cugetreg/zod-schemas/courses";
import type { CourseReview } from "@cugetreg/zod-schemas/courses-response";

export async function queryCourse(
  query: GetCourseQuerySchema,
  userId?: string,
) {
  const {
    studyProgram,
    academicYear,
    semester,
    genEdTypes,
    faculties,
    sortBy,
    sortOrder,
    days,
    assessment,
    limit,
    offset,
    q,
    timeStart,
    timeEnd,
    noPrereq,
    fitCartId,
  } = query;

  const selectedGenEdTypes =
    !genEdTypes || Array.isArray(genEdTypes) ? genEdTypes : [genEdTypes];
  const selectedDays = !days || Array.isArray(days) ? days : [days];
  const selectedFaculties =
    !faculties || Array.isArray(faculties) ? faculties : [faculties];

  if (fitCartId) {
    if (!userId) {
      throw new Error("UNAUTHORIZED");
    }

    const cart = await prisma.cart.findFirst({
      where: { id: fitCartId },
    });

    if (!cart) {
      throw new Error("CART_DOES_NOT_EXIST");
    }

    if (cart.userId !== userId) {
      throw new Error("NOT_CART_OWNER");
    }
  }

  const rawResults = await prisma.$queryRawTyped(
    getCourseList(
      studyProgram,
      academicYear,
      semester,
      (selectedGenEdTypes as any) ?? null,
      (selectedFaculties as any) ?? null,
      selectedDays
        ? (selectedDays.map((day) => mapDayOfWeek(day)) as any)
        : null,
      assessment ?? null,
      q ? `%${q}%` : null,
      noPrereq ?? null,
      timeStart ?? null,
      timeEnd ?? null,
      limit ?? 10,
      offset ?? 0,
      sortBy ?? null,
      sortOrder ?? "desc",
      fitCartId ?? null,
    ),
  );

  if (rawResults.length === 0) {
    return { data: [], total: 0 };
  }

  const total = rawResults[0]!.total_count ?? 0;

  const courseNos = rawResults.map((r) => r.course_no);
  const reviewCounts = await prisma.review.groupBy({
    by: ["courseNo"],
    _count: { _all: true },
    where: { courseNo: { in: courseNos } },
  });
  const reviewCountMap = new Map(
    reviewCounts.map((r) => [r.courseNo, r._count._all]),
  );

  const data = rawResults.map((row) => ({
    course: {
      id: row.id,
      studyProgram: row.study_program,
      academicYear: row.academic_year,
      semester: row.semester,
      courseNo: row.course_no,
      courseCondition: row.course_condition,
      genEdType: row.gen_ed_type,
      midtermStart: row.midterm_start?.toISOString() ?? null,
      midtermEnd: row.midterm_end?.toISOString() ?? null,
      finalStart: row.final_start?.toISOString() ?? null,
      finalEnd: row.final_end?.toISOString() ?? null,
      sections: (row.sections as any[]) ?? [],
    },
    courseInfo: {
      abbrName: row.abbr_name,
      courseNameEn: row.course_name_en,
      courseNameTh: row.course_name_th,
      courseDescEn: row.course_desc_en,
      courseDescTh: row.course_desc_th,
      faculty: row.faculty ?? "",
      department: row.department ?? "",
      credit: row.credit ?? "",
      creditHours: row.credit_hours ?? "",
    },
    stats: {
      sectionsCount: row.sections_count ?? 0,
      capacitySum: row.capacity_sum ?? 0,
      remainingSum: row.remaining_sum ?? 0,
      hasSeats: (row.remaining_sum ?? 0) > 0,
      isClosedAll:
        (row.sections_count ?? 0) > 0 &&
        (row.closed_sections_count ?? 0) === (row.sections_count ?? 0),
    },
    reviewCount: reviewCountMap.get(row.course_no) ?? 0,
  }));

  return { data, total };
}

export async function getCourseReviewByCourseNo(
  courseNo: string,
  limit: number,
  page: number,
  userId?: string,
) {
  const courseInfo = await prisma.courseInfo.findUnique({
    where: { courseNo },
    select: { courseNo: true },
  });

  if (!courseInfo) {
    throw new Error("COURSE_NOT_FOUND");
  }

  const where: Prisma.ReviewWhereInput = userId
    ? {
        courseNo,
        OR: [
          { userId },
          { status: ReviewStatus.APPROVED, userId: { not: userId } },
        ],
      }
    : { courseNo, status: ReviewStatus.APPROVED };

  const [reviews, count] = await prisma.$transaction([
    prisma.review.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        rating: true,
        status: true,
        studyProgram: true,
        academicYear: true,
        semester: true,
        content: true,
      },
    }),
    prisma.review.count({ where }),
  ]);

  const reviewIds = reviews.map((review) => review.id);
  const voteCounts =
    reviewIds.length === 0
      ? []
      : await prisma.reviewVote.groupBy({
          by: ["reviewId", "voteType"],
          where: {
            reviewId: { in: reviewIds },
          },
          _count: {
            _all: true,
          },
        });

  const userVotes =
    userId && reviewIds.length > 0
      ? await prisma.reviewVote.findMany({
          where: {
            userId,
            reviewId: { in: reviewIds },
          },
          select: {
            reviewId: true,
            voteType: true,
          },
        })
      : [];

  const reactions = new Map(
    userVotes.map((vote) => [vote.reviewId, vote.voteType]),
  );

  const resultReviews = reviews.map((review) => {
    const reviewVotes = voteCounts.filter((v) => v.reviewId === review.id);
    const likeCount =
      reviewVotes.find((v) => v.voteType === VoteType.L)?._count._all ?? 0;
    const dislikeCount =
      reviewVotes.find((v) => v.voteType === VoteType.D)?._count._all ?? 0;
    const reaction = reactions.get(review.id);

    return {
      ...review,
      stats: {
        likeCount,
        dislikeCount,
      },
      ...(reaction && { reaction }),
    } as CourseReview;
  });

  return { reviews: resultReviews, count };
}
