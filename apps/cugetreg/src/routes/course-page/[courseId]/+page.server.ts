import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';
import axios from 'axios';

import { CourseNoResponseSchema } from '@cugetreg/zod-schemas/courses-response';

import type { PageServerLoad } from './$types';

const API_URL = 'http://localhost:3000/api/v1/courses/';

function mapSemester(semester: string) {
  switch (semester) {
    default:
    case 'FIRST':
      return '1';
    case 'SECOND':
      return '2';
    case 'SUMMER':
      return '3';
  }
}

export const load: PageServerLoad = async ({ params, url }) => {
  const courseId = params.courseId;

  const academicYear = url.searchParams.get('academicYear') ?? 2568;
  const semester = url.searchParams.get('semester') ?? 1;
  const studyProgram = url.searchParams.get('studyProgram') ?? 'S';

  const [response, error] = await tryCatch(
    axios.get(API_URL + courseId, {
      params: {
        studyProgram,
        academicYear,
        semester: mapSemester(String(semester)),
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
