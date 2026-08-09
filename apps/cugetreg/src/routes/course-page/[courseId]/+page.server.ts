import { env as privateEnv } from '$env/dynamic/private';
import { env } from '$env/dynamic/public';
import { tryCatch } from '$lib/async-handler';

import { error as svelteError, redirect } from '@sveltejs/kit';

import {
  CourseNoResponseSchema,
  CourseReviewResponseSchema,
} from '@cugetreg/zod-schemas/courses-response';

import type { PageServerLoad, PageServerLoadEvent } from './$types';

const REVIEW_PAGE_SIZE = 4;

async function fetchInitialReviews(
  fetch: PageServerLoadEvent['fetch'],
  reviewsUrl: string,
) {
  const params = new URLSearchParams({
    includeFacets: 'true',
    limit: String(REVIEW_PAGE_SIZE),
    page: '1',
  });
  const response = await fetch(`${reviewsUrl}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.status}`);
  }

  return CourseReviewResponseSchema.parse(await response.json());
}

export const load: PageServerLoad = async ({ params, url, parent, fetch }) => {
  const API_BASE = privateEnv.API_URL
    ? `${privateEnv.API_URL}/api/v1`
    : env.PUBLIC_API_URL;
  const API_URL = `${API_BASE}/courses/`;
  const courseId = params.courseId;

  const academicYear = url.searchParams.get('academicYear');
  const semester = url.searchParams.get('semester');
  const studyProgram = url.searchParams.get('studyProgram');

  if (!academicYear || !semester || !studyProgram) {
    const parentData = await parent();
    const currentCart = (await parentData.cart)?.currentCart;
    const fallbackYear = String(currentCart?.academicYear ?? 2566);
    const fallbackSemester = currentCart?.semester ?? 'FIRST';
    const fallbackStudyProgram = currentCart?.studyProgram ?? 'S';

    const redirectParams = new URLSearchParams(url.searchParams);
    if (!academicYear) redirectParams.set('academicYear', fallbackYear);
    if (!semester) redirectParams.set('semester', fallbackSemester);
    if (!studyProgram) redirectParams.set('studyProgram', fallbackStudyProgram);

    throw redirect(
      302,
      `/course-page/${courseId}?${redirectParams.toString()}`,
    );
  }

  const queryParams = new URLSearchParams({
    studyProgram: String(studyProgram),
    academicYear: String(academicYear),
    semester,
  });

  const [[response, responseError], [reviewData, reviewsError]] =
    await Promise.all([
      tryCatch(fetch(`${API_URL}${courseId}?${queryParams.toString()}`)),
      tryCatch(fetchInitialReviews(fetch, `${API_URL}reviews/${courseId}`)),
    ]);

  if (responseError || !response) {
    if (responseError) console.error(responseError);
    throw svelteError(502, 'Unable to fetch course');
  }

  if (response.status === 404) {
    throw svelteError(404, 'Course not found');
  }

  if (!response.ok) {
    throw svelteError(502, 'Unable to fetch course');
  }

  const [courseData, courseDataError] = await tryCatch(
    response
      .json()
      .then((responseData) => CourseNoResponseSchema.parse(responseData)),
  );

  if (courseDataError || !courseData) {
    if (courseDataError) console.error(courseDataError);
    throw svelteError(502, 'Invalid course response');
  }

  if (reviewsError) console.error(reviewsError);

  return {
    course: courseData.course,
    reviews: reviewData?.reviews ?? [],
    reviewCount: reviewData?.count ?? 0,
    reviewFacets: reviewData?.facets ?? [],
    reviewsError: Boolean(reviewsError),
  };
};
