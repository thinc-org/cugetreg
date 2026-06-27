import { env } from '$env/dynamic/public';
import { tryCatch } from '$lib/async-handler';

import { error as svelteError, redirect } from '@sveltejs/kit';

import { CourseNoResponseSchema } from '@cugetreg/zod-schemas/courses-response';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, parent, fetch }) => {
  const API_URL = `${env.PUBLIC_API_URL ?? 'http://localhost:3000'}/courses/`;
  const courseId = params.courseId;

  const academicYear = url.searchParams.get('academicYear');
  const semester = url.searchParams.get('semester');
  const studyProgram = url.searchParams.get('studyProgram');

  if (!academicYear || !semester || !studyProgram) {
    const parentData = await parent();
    const currentCart = parentData.data?.currentCart;
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

  const [response, error] = await tryCatch(
    fetch(`${API_URL}${courseId}?${queryParams.toString()}`),
  );

  if (error || !response || !response.ok) {
    if (error) console.error(error);
    throw svelteError(404, 'Course not found');
  }

  const resData = await response.json();
  const { course, reviews } = CourseNoResponseSchema.parse(resData);
  return {
    course,
    reviews,
  };
};
