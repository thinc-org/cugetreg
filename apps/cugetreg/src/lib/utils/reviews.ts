import { getSemesterLabel } from '$lib/semesterOptions';

import type { Locale } from '@cugetreg/ui/i18n';
import type { ReviewSchema } from '@cugetreg/zod-schemas';

import { genEdTypeMapper } from '../mapper';

export function convertReviewInfos(
  reviews: ReviewSchema[],
  locale: Locale = 'th',
) {
  return reviews.map((review) => ({
    code: review.courseNo,
    name: review.courseAbbrName,
    tag: genEdTypeMapper(review.genEdType, locale),
    status: review.status,
    rating: Number((review.rating / 2).toFixed(1)),
    term: `${review.academicYear.toString()} ${getSemesterLabel(review.semester, locale)}`,
  }));
}
