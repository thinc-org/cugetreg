import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';

import { CourseNoResponseSchema } from '@cugetreg/zod-schemas/courses-response';

import type { PageServerLoad } from './$types';

const studyProgram = 'I';
const academicYear = 2566;
const semester = 1;

const API_URL = 'http://localhost:3000/api/v1/courses/';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const courseId = params.courseId;

  const url = new URL(API_URL + courseId);
  url.searchParams.append('studyProgram', studyProgram);
  url.searchParams.append('academicYear', academicYear.toString());
  url.searchParams.append('semester', semester.toString());

  const [response, error] = await tryCatch(fetch(url.toString()));

  if (error || !response || !response.ok) {
    throw svelteError(404, 'Course not found');
  }

  const data = await response.json();
  const course = CourseNoResponseSchema.parse(data);
  return {
    course,
  };
};
