import { normalizeDayMapper } from '$lib/mapper';

import type { Course as CourseCardCourse } from '@cugetreg/ui/molecules/course-card';
import type { Day } from '@cugetreg/utils/types';
import type { CourseDetails } from '@cugetreg/zod-schemas';

export interface HomeCourse {
  recommended: boolean;
  course: CourseDetails['course'] &
    CourseCardCourse & {
      courseInfo: CourseDetails['courseInfo'];
      isFavorite: boolean;
      closed: boolean;
    };
}

export function mapCourse(item: CourseDetails): HomeCourse {
  const { course, courseInfo, reviewCount, stats } = item;
  const days = Array.from(
    new Set(
      course.sections
        .flatMap((section) =>
          section.classes.map((courseClass) => courseClass.dayOfWeek),
        )
        .map(normalizeDayMapper)
        .filter((day: Day | undefined): day is Day => Boolean(day)),
    ),
  );

  return {
    recommended: false,
    course: {
      ...course,
      courseInfo,
      code: course.courseNo,
      name:
        courseInfo.abbrName ||
        courseInfo.courseNameEn ||
        courseInfo.courseNameTh ||
        '-',
      credit: Number(courseInfo.credit) || 0,
      maxseat: stats.capacitySum,
      seat: stats.capacitySum - stats.remainingSum,
      gened: course.genEdType === 'NO' ? [] : [course.genEdType],
      review: reviewCount,
      days,
      isFavorite: course.isFavorite ?? false,
      closed: stats.isClosedAll,
    },
  };
}
