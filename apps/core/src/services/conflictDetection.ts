import dayjs from "dayjs";

import type {
  ClassConflict,
  ClassScheduleItem,
  ExamConflict,
  ExamScheduleItem,
} from "../zod_schemas/carts.response.schema.js";

// O(n²) pairwise check — carts are small (< 10 courses) so this is fine
export function detectClassConflicts(
  classes: ClassScheduleItem[],
): ClassConflict[] {
  const conflicts: ClassConflict[] = [];
  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const a = classes[i];
      const b = classes[j];
      // Anchor times to a fixed date so dayjs can compare HH:mm strings
      if (a.dayOfWeek === b.dayOfWeek) {
        const startA = dayjs(`2000-01-01T${a.periodStart}`);
        const endA = dayjs(`2000-01-01T${a.periodEnd}`);
        const startB = dayjs(`2000-01-01T${b.periodStart}`);
        const endB = dayjs(`2000-01-01T${b.periodEnd}`);
        if (startA.isBefore(endB) && startB.isBefore(endA)) {
          conflicts.push({
            type: "TIME_OVERLAP",
            itemIds: [a.cartItemId, b.cartItemId],
            dayOfWeek: a.dayOfWeek,
            periodStart: a.periodStart,
            periodEnd: a.periodEnd,
          });
        }
      }
    }
  }
  return conflicts;
}

export function detectExamConflicts(exams: ExamScheduleItem[]): ExamConflict[] {
  const conflicts: ExamConflict[] = [];
  for (let i = 0; i < exams.length; i++) {
    for (let j = i + 1; j < exams.length; j++) {
      const a = exams[i];
      const b = exams[j];
      const startA = dayjs(a.start);
      const endA = dayjs(a.end);
      const startB = dayjs(b.start);
      const endB = dayjs(b.end);
      if (startA.isBefore(endB) && startB.isBefore(endA)) {
        conflicts.push({
          type: "EXAM_OVERLAP",
          itemIds: [a.cartItemId, b.cartItemId],
          start: startA.isAfter(startB) ? a.start : b.start,
          end: endA.isBefore(endB) ? a.end : b.end,
        });
      }
    }
  }
  return conflicts;
}
