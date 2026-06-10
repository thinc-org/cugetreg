import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';
import axios from 'axios';

import { CourseNoResponseSchema } from '@cugetreg/zod-schemas/courses-response';

import type { PageServerLoad } from './$types';

// TODO: How to reconcile?
const studyProgram = 'S';
const academicYear = 2566;
const semester = 1;

// TODO: Remove this
const API_URL = 'http://localhost:3000/api/v1/courses/';

export const load: PageServerLoad = async ({ params }) => {
  const courseId = params.courseId;

  const [response, error] = await tryCatch(
    axios.get(API_URL + courseId, {
      params: {
        studyProgram,
        academicYear,
        semester,
      },
    }),
  );

  if (error || !response) {
    throw svelteError(404, 'Course not found');
  }

  const course = CourseNoResponseSchema.parse(response.data);
  return {
    course,
  };
};
