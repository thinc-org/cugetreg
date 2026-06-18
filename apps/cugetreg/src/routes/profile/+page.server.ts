import { tryCatch } from '$lib/async-handler';
import { convertUserInfo } from '$lib/utils/user';
import { error as SvelteError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { UserResponseSchema } from '@cugetreg/zod-schemas';

const USER_API_URL = 'http://localhost:3000/api/v1/user';

export const load: PageServerLoad = async ({ fetch }) => {
  const [response, error] = await tryCatch(fetch(USER_API_URL));

  if (error || !response || !response.ok) {
    throw SvelteError(500, 'Error fetching user');
  }

  const resData = await response.json();
  const data = UserResponseSchema.parse(resData);

  return { user: convertUserInfo(data) };
};
