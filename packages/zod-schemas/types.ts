import z from "zod";

export const Period = z.object({
  type: z.string(),
  dayOfWeek: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  building: z.string().nullable(),
  room: z.string().nullable(),
  professors: z.array(z.string()),
});

export const Section = z.object({
  id: z.string(),
  sectionNo: z.number().int(),
  closed: z.boolean(),
  regis: z.number(),
  max: z.number(),
  note: z.string().nullable(),
  classes: z.array(Period),
});

export type Section = z.infer<typeof Section>;
export type Period = z.infer<typeof Period>;
