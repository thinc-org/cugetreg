import type { Prisma } from "@/generated/prisma/client.ts";

import {
  FACULTIES,
  type FacultyId,
  UNKNOWN_FACULTY,
} from "@cugetreg/utils/faculty";
import type { ReviewSortBy } from "@cugetreg/zod-schemas/constants";

export function mapFaculty(facultyId: string) {
  return FACULTIES[facultyId as FacultyId] ?? UNKNOWN_FACULTY;
}

export const reviewOrderByMapping: Record<
  ReviewSortBy,
  (order: Prisma.SortOrder) => Prisma.ReviewOrderByWithRelationInput
> = {
  RATING: (order) => ({ rating: order }),
  NAME: (order) => ({ courseInfo: { abbrName: order } }),
  DATE_CREATE: (order) => ({ createdAt: order }),
};
