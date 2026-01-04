import z from "zod";

export const CartSchema = z.object({
  id: z.string(),
  userId: z.string(),
  studyProgram: z.string(),
  academicYear: z.number(),
  semester: z.string(),
  name: z.string(),
  visible: z.string(),
  isDefault: z.boolean(),
  cartOrder: z.number(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export const ListCartsResponseSchema = z.object({
  data: z.array(CartSchema),
});

export const SingleCartResponseSchema = z.object({
  data: CartSchema,
});

const CartItemDetailSchema = z.object({
  id: z.string(),
  courseNo: z.string(),
  sectionNo: z.number(),
  color: z.string().nullable(),
  hidden: z.boolean(),
  cartOrder: z.number(),
  isGraded: z.boolean(),
  expectedGrade: z.string(),
  course: z.object({
    courseNameTh: z.string(),
    courseNameEn: z.string(),
    credit: z.string(),
  }),
  section: z
    .object({
      closed: z.boolean(),
      regis: z.number(),
      max: z.number(),
      note: z.string().nullable(),
    })
    .nullable(),
});

export const CartDetailResponseSchema = z.object({
  data: z.object({
    cart: z.object({
      id: z.string(),
      name: z.string(),
      studyProgram: z.string(),
      academicYear: z.number(),
      semester: z.string(),
      visible: z.string(),
      isDefault: z.boolean(),
      cartOrder: z.number(),
      items: z.array(CartItemDetailSchema),
    }),
    summary: z.object({
      totalCredits: z.string(),
      totalVisibleCredits: z.string(),
      totalGradedCredits: z.string(),
      expectedGPA: z.number(),
    }),
    conflicts: z.object({
      classConflicts: z.array(z.any()),
      examConflicts: z.array(z.any()),
    }),
    schedule: z.object({
      classes: z.array(z.any()),
      exams: z.array(z.any()),
    }),
  }),
});

export const SingleCartItemResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    cartId: z.string(),
    courseNo: z.string(),
    sectionNo: z.number(),
    color: z.string().nullable(),
    hidden: z.boolean(),
    cartOrder: z.number(),
    isGraded: z.boolean(),
    expectedGrade: z.string(),
    createdAt: z.union([z.date(), z.string()]),
    updatedAt: z.union([z.date(), z.string()]),
  }),
});
