import { createRoute, z } from "@hono/zod-openapi";

import {
  AddPlanItemBodySchema,
  AddPlanItemsFromCartBodySchema,
  CartCandidatesQuerySchema,
  CreateStudyPlanBodySchema,
  UpdateCustomCreditTargetBodySchema,
  UpdateGradesBodySchema,
  UpdateStudyPlanBodySchema,
} from "@cugetreg/zod-schemas/study-plans";
import {
  AddPlanItemsFromCartResponseSchema,
  CartCandidatesResponseSchema,
  ListStudyPlansResponseSchema,
  PlanItemSchema,
  SingleCustomCreditTargetResponseSchema,
  SinglePlanItemResponseSchema,
  SingleStudyPlanResponseSchema,
  StudyPlanDetailResponseSchema,
  StudyPlanGradesResponseSchema,
} from "@cugetreg/zod-schemas/study-plans-response";

import { errorRes, InternalError } from "./errorRes.js";

const planIdParam = z.object({ planId: z.string() });

// 4.1 List
export const listStudyPlansRoute = createRoute({
  method: "get",
  path: "/",
  summary: "4.1 List current user's study plans",
  responses: {
    200: {
      content: { "application/json": { schema: ListStudyPlansResponseSchema } },
      description: "OK",
    },
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.2 Create
export const createStudyPlanRoute = createRoute({
  method: "post",
  path: "/",
  summary: "4.2 Create a study plan, optionally seeded from a curriculum",
  request: {
    body: {
      content: { "application/json": { schema: CreateStudyPlanBodySchema } },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": { schema: SingleStudyPlanResponseSchema },
      },
      description: "Created",
    },
    404: errorRes("CURRICULUM_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.3 Detail
export const getStudyPlanDetailRoute = createRoute({
  method: "get",
  path: "/{planId}",
  summary: "4.3 Get study plan detail (categories, credit targets, items)",
  request: { params: planIdParam },
  responses: {
    200: {
      content: {
        "application/json": { schema: StudyPlanDetailResponseSchema },
      },
      description: "OK",
    },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("PLAN_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.4 Rename
export const updateStudyPlanRoute = createRoute({
  method: "patch",
  path: "/{planId}",
  summary: "4.4 Rename a study plan",
  request: {
    params: planIdParam,
    body: {
      content: { "application/json": { schema: UpdateStudyPlanBodySchema } },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: SingleStudyPlanResponseSchema },
      },
      description: "Updated",
    },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("PLAN_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.5 Set as main plan
export const pinStudyPlanRoute = createRoute({
  method: "patch",
  path: "/{planId}/pin",
  summary: "4.5 Set this plan as the user's main plan",
  request: { params: planIdParam },
  responses: {
    200: { description: "Pinned" },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("PLAN_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.5b Add one more term beyond the base 4 years / 8 terms
export const addStudyPlanTermRoute = createRoute({
  method: "post",
  path: "/{planId}/terms",
  summary: "4.5b Add one more term to the plan (for students past 4 years)",
  request: { params: planIdParam },
  responses: {
    200: {
      content: {
        "application/json": { schema: SingleStudyPlanResponseSchema },
      },
      description: "Added",
    },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("PLAN_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.6 Edit a custom credit target
export const updateCustomCreditTargetRoute = createRoute({
  method: "patch",
  path: "/{planId}/custom-credit-targets/{creditTargetId}",
  summary: "4.6 Edit a custom credit target",
  request: {
    params: planIdParam.extend({ creditTargetId: z.string() }),
    body: {
      content: {
        "application/json": { schema: UpdateCustomCreditTargetBodySchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: SingleCustomCreditTargetResponseSchema },
      },
      description: "Updated",
    },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("CREDIT_TARGET_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.7 Add course by course number
export const addPlanItemRoute = createRoute({
  method: "post",
  path: "/{planId}/items",
  summary: "4.7 Add a course to a term by course number",
  request: {
    params: planIdParam,
    body: {
      content: { "application/json": { schema: AddPlanItemBodySchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: SinglePlanItemResponseSchema } },
      description: "Added",
    },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("PLAN_NOT_FOUND / COURSE_NOT_FOUND / CATEGORY_NOT_FOUND"),
    409: errorRes("COURSE_ALREADY_IN_PLAN"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.8 List candidate courses from the user's real schedule for a given semester
export const listCartCandidatesRoute = createRoute({
  method: "get",
  path: "/{planId}/cart-candidates",
  summary:
    "4.8 List the user's schedule courses available to import for a semester",
  request: {
    params: planIdParam,
    query: CartCandidatesQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: CartCandidatesResponseSchema },
      },
      description: "OK",
    },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("PLAN_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.9 Add courses from the user's real schedule
export const addPlanItemsFromCartRoute = createRoute({
  method: "post",
  path: "/{planId}/items/from-cart",
  summary: "4.9 Add courses to a term from the user's real schedule",
  request: {
    params: planIdParam,
    body: {
      content: {
        "application/json": { schema: AddPlanItemsFromCartBodySchema },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": { schema: AddPlanItemsFromCartResponseSchema },
      },
      description: "Added",
    },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("PLAN_NOT_FOUND / CATEGORY_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.10 Remove a course from the plan
export const removePlanItemRoute = createRoute({
  method: "delete",
  path: "/{planId}/items/{itemId}",
  summary: "4.10 Remove a course from the plan",
  request: { params: planIdParam.extend({ itemId: z.string() }) },
  responses: {
    204: { description: "Deleted" },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("ITEM_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.11 Grade calculation page
export const getStudyPlanGradesRoute = createRoute({
  method: "get",
  path: "/{planId}/grades",
  summary: "4.11 Get the grade calculation page data (per-term GPA + GPAX)",
  request: { params: planIdParam },
  responses: {
    200: {
      content: {
        "application/json": { schema: StudyPlanGradesResponseSchema },
      },
      description: "OK",
    },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("PLAN_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});

// 4.12 Batch grade update — called periodically by the client while editing
export const updateGradesRoute = createRoute({
  method: "patch",
  path: "/{planId}/grades",
  summary: "4.12 Batch-update grades on the grade calculation page",
  request: {
    params: planIdParam,
    body: {
      content: { "application/json": { schema: UpdateGradesBodySchema } },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ data: z.array(PlanItemSchema) }),
        },
      },
      description: "Updated",
    },
    403: errorRes("NOT_PLAN_OWNER"),
    404: errorRes("ITEM_NOT_FOUND"),
    500: InternalError,
  },
  security: [{ Bearer: [] }],
});
