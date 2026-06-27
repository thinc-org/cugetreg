import { env } from '$env/dynamic/public';
import { tryCatch } from '$lib/async-handler';
import { convertUserInfo } from '$lib/utils/user';

import { error as SvelteError } from '@sveltejs/kit';

import { UserResponseSchema } from '@cugetreg/zod-schemas';

import type { PageServerLoad } from './$types';

const USER_API_URL = `${env.PUBLIC_API_URL}/user`;

export const load: PageServerLoad = async ({ fetch }) => {
  const [response, error] = await tryCatch(fetch(USER_API_URL));

  if (error || !response || !response.ok) {
    throw SvelteError(500, 'Error fetching user');
  }

  const resData = await response.json();
  const data = UserResponseSchema.parse(resData);

  return { user: convertUserInfo(data) };
};
