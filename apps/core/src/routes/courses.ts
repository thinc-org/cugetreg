import { OpenAPIHono } from "@hono/zod-openapi";

import type { CourseReview } from "@cugetreg/zod-schemas/courses-response";

import { prisma } from "../db/clients.js";
import { ReviewStatus, VoteType } from "../generated/prisma/client.js";
import type { Variables } from "../lib/auth.js";
import {
  getCourseByNoRoute,
  getCoursesRoute,
} from "../routes_define/courses.routes.js";
import { queryCourse } from "../services/coursesService.js";
import { mapSemester, mapStudyProgram } from "../utils/enumMapper.js";

const courses = new OpenAPIHono<{ Variables: Variables }>();

courses
  // 1.1. Get Courses
  .openapi(getCoursesRoute, async (c) => {
    try {
      const query = c.req.valid("query");
      const user = c.get("user");
      const result = await queryCourse(query, user?.id);
      return c.json(result, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "UNAUTHORIZED") {
          return c.json({ error: "UNAUTHORIZED" }, 401);
        }
        if (
          err.message === "CART_DOES_NOT_EXIST" ||
          err.message === "NOT_CART_OWNER"
        ) {
          return c.json({ error: "NOT_CART_OWNER" }, 403);
        }
      }
      console.error("Fetch Courses Error:", err);
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 1.2. Get Course Detail
  .openapi(getCourseByNoRoute, async (c) => {
    try {
      const { courseNo } = c.req.valid("param");
      const { studyProgram, academicYear, semester } = c.req.valid("query");

      const course = await prisma.course.findFirst({
        where: {
          courseNo,
          studyProgram: mapStudyProgram(studyProgram),
          academicYear,
          semester: mapSemester(semester),
        },
        include: {
          courseInfo: true,
          sections: { include: { classes: true } },
        },
      });

      if (!course) {
        return c.json({ message: "Course not found" }, 404);
      }

      const userId = c.get("user")?.id;

      const allReviews = await prisma.review.findMany({
        where: {
          courseNo,
          ...(userId && {
            OR: [
              { userId },
              { status: ReviewStatus.APPROVED, userId: { not: userId } },
            ],
          }),
          ...(!userId && { status: ReviewStatus.APPROVED }),
        },
        include: {
          votes: true,
        },
      });

      const reviews = allReviews.map((review) => {
        let reaction: VoteType | undefined = undefined;
        const [likeCount, dislikeCount] = review.votes.reduce(
          ([like, dislike], vote) => {
            if (vote.userId === userId) {
              reaction = vote.voteType;
            }

            return [
              like + (vote.voteType === VoteType.L ? 1 : 0),
              dislike + (vote.voteType === VoteType.D ? 1 : 0),
            ];
          },
          [0, 0],
        );

        return {
          id: review.id,
          rating: review.rating,
          status: review.status,
          studyProgram: review.studyProgram,
          academicYear: review.academicYear,
          semester: review.semester,
          content: review.content,
          stats: {
            likeCount,
            dislikeCount,
          },
          reaction,
        } as CourseReview;
      });

      return c.json(
        {
          course,
          reviews,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default courses;
