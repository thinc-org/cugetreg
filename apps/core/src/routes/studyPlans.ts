import type { Variables } from "@/lib/auth.js";
import {
  addPlanItemRoute,
  addPlanItemsFromCartRoute,
  addStudyPlanTermRoute,
  createStudyPlanRoute,
  getStudyPlanDetailRoute,
  getStudyPlanGradesRoute,
  listCartCandidatesRoute,
  listStudyPlansRoute,
  pinStudyPlanRoute,
  removePlanItemRoute,
  updateCustomCreditTargetRoute,
  updateGradesRoute,
  updateStudyPlanRoute,
} from "@/routes_define/studyPlans.routes.js";
import { studyPlansService } from "@/services/studyPlansService.js";

import { OpenAPIHono } from "@hono/zod-openapi";

const studyPlans = new OpenAPIHono<{ Variables: Variables }>()

  // 4.1 List
  .openapi(listStudyPlansRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const data = await studyPlansService.listStudyPlans(userId);
      return c.json({ data }, 200);
    } catch {
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.2 Create
  .openapi(createStudyPlanRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const body = c.req.valid("json");
      const plan = await studyPlansService.createStudyPlan(userId, body);
      return c.json({ data: plan }, 201);
    } catch (err) {
      if (err instanceof Error && err.message === "CURRICULUM_NOT_FOUND") {
        return c.json({ error: "CURRICULUM_NOT_FOUND" }, 404);
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.3 Detail
  .openapi(getStudyPlanDetailRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId } = c.req.valid("param");
      const data = await studyPlansService.getStudyPlanDetail(userId, planId);
      return c.json({ data }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "PLAN_NOT_FOUND") {
          return c.json({ error: "PLAN_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.4 Rename
  .openapi(updateStudyPlanRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId } = c.req.valid("param");
      const body = c.req.valid("json");
      const plan = await studyPlansService.updateStudyPlanName(
        userId,
        planId,
        body,
      );
      return c.json({ data: plan }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "PLAN_NOT_FOUND") {
          return c.json({ error: "PLAN_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.5 Set as main plan
  .openapi(pinStudyPlanRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId } = c.req.valid("param");
      await studyPlansService.setDefaultStudyPlan(userId, planId);
      return c.json({ description: "Pinned" }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "PLAN_NOT_FOUND") {
          return c.json({ error: "PLAN_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.5b Add one more term
  .openapi(addStudyPlanTermRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId } = c.req.valid("param");
      const plan = await studyPlansService.addTerm(userId, planId);
      return c.json({ data: plan }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "PLAN_NOT_FOUND") {
          return c.json({ error: "PLAN_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.6 Edit custom credit target
  .openapi(updateCustomCreditTargetRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId, creditTargetId } = c.req.valid("param");
      const body = c.req.valid("json");
      const target = await studyPlansService.updateCustomCreditTarget(
        userId,
        planId,
        creditTargetId,
        body,
      );
      return c.json({ data: target }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "CREDIT_TARGET_NOT_FOUND") {
          return c.json({ error: "CREDIT_TARGET_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.7 Add course by course number
  .openapi(addPlanItemRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId } = c.req.valid("param");
      const body = c.req.valid("json");
      const item = await studyPlansService.addPlanItem(userId, planId, body);
      return c.json({ data: item }, 201);
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.message === "PLAN_NOT_FOUND" ||
          err.message === "COURSE_NOT_FOUND" ||
          err.message === "CATEGORY_NOT_FOUND"
        ) {
          return c.json({ error: err.message }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
        if (err.message === "COURSE_ALREADY_IN_PLAN") {
          return c.json({ error: "COURSE_ALREADY_IN_PLAN" }, 409);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.8 List cart candidates
  .openapi(listCartCandidatesRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId } = c.req.valid("param");
      const { semester } = c.req.valid("query");
      const data = await studyPlansService.listCartCandidates(
        userId,
        planId,
        semester,
      );
      return c.json({ data }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "PLAN_NOT_FOUND") {
          return c.json({ error: "PLAN_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.9 Add courses from the user's real schedule
  .openapi(addPlanItemsFromCartRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId } = c.req.valid("param");
      const body = c.req.valid("json");
      const data = await studyPlansService.addPlanItemsFromCart(
        userId,
        planId,
        body,
      );
      return c.json({ data }, 201);
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.message === "PLAN_NOT_FOUND" ||
          err.message === "CATEGORY_NOT_FOUND"
        ) {
          return c.json({ error: err.message }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.10 Remove a course
  .openapi(removePlanItemRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId, itemId } = c.req.valid("param");
      await studyPlansService.removePlanItem(userId, planId, itemId);
      return c.body(null, 204);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "ITEM_NOT_FOUND") {
          return c.json({ error: "ITEM_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.11 Grade calculation page
  .openapi(getStudyPlanGradesRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId } = c.req.valid("param");
      const data = await studyPlansService.getStudyPlanGrades(userId, planId);
      return c.json({ data }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "PLAN_NOT_FOUND") {
          return c.json({ error: "PLAN_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  })

  // 4.12 Batch grade update (polled every ~10s from the grade page)
  .openapi(updateGradesRoute, async (c) => {
    try {
      const userId = c.get("user").id;
      const { planId } = c.req.valid("param");
      const body = c.req.valid("json");
      const data = await studyPlansService.updateGrades(userId, planId, body);
      return c.json({ data }, 200);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "ITEM_NOT_FOUND") {
          return c.json({ error: "ITEM_NOT_FOUND" }, 404);
        }
        if (err.message === "NOT_PLAN_OWNER") {
          return c.json({ error: "NOT_PLAN_OWNER" }, 403);
        }
      }
      return c.json({ error: "INTERNAL_SERVER_ERROR" }, 500);
    }
  });

export default studyPlans;
