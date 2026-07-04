import { z } from "zod";

export const ImportTimetableBodySchema = z
  .object({
    cartId: z.string().nonempty(),
    name: z.string().nonempty().optional(),
  })
  .strict();

export type ImportTimetableBodySchema = z.output<
  typeof ImportTimetableBodySchema
>;
