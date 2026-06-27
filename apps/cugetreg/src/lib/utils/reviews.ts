import { SEMESTER_LABEL_LONG } from '$lib/semesterOptions';

import type { ReviewSchema } from '@cugetreg/zod-schemas';

import { genEdTypeMapper } from '../mapper';

export function convertReviewInfos(reviews: ReviewSchema[]) {
  return reviews.map((review) => ({
    code: review.courseNo,
    name: review.courseAbbrName,
    tag: genEdTypeMapper(review.genEdType),
    status: review.status,
    rating: Number((review.rating / 2).toFixed(1)),
    term: `${review.academicYear.toString()} ${SEMESTER_LABEL_LONG[review.semester]}`,
  }));
}
