import { z } from "zod";

export const ImportTimetableBodySchema = z
  .object({
    name: z.string().nonempty().optional(),
  })
  .strict();

export type ImportTimetableBodySchema = z.output<
  typeof ImportTimetableBodySchema
>;
