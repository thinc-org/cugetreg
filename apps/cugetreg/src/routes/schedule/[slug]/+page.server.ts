import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';

import type { SemesterType } from '@cugetreg/utils/types';
import { PublicCartDetailResponseSchema } from '@cugetreg/zod-schemas/public-cart-response';

import type { PageServerLoad } from './$types';

const API_URL = 'http://localhost:3000/api/v1/public/carts/';

const toSemesterType = (studyProgram: string): SemesterType => {
  switch (studyProgram) {
    case 'S':
      return 'Semester';
    case 'I':
      return 'Inter';
    case 'T':
      return 'Trimester';
    default:
      return 'Semester';
  }
};

export const load: PageServerLoad = async ({ params, fetch }) => {
  const cartId = params.slug;

  const [response, error] = await tryCatch(fetch(API_URL + cartId));

  if (error || !response || !response.ok) {
    throw svelteError(404, 'Cart not found or API error');
  }

  const resData = await response.json();
  const data = PublicCartDetailResponseSchema.parse(resData).data;
  return {
    data: data,
    semesterType: toSemesterType(data.cart.studyProgram),
  };
};
