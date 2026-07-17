import { env as privateEnv } from '$env/dynamic/private';
import { env } from '$env/dynamic/public';
import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';

import { PublicCartDetailResponseSchema } from '@cugetreg/zod-schemas/public-carts-response';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const API_BASE = privateEnv.API_URL
    ? `${privateEnv.API_URL}/api/v1`
    : env.PUBLIC_API_URL;
  const API_URL = `${API_BASE}/public/carts/`;
  const cartId = params.slug;

  const [response, error] = await tryCatch(fetch(API_URL + cartId));

  if (error || !response || !response.ok) {
    throw svelteError(404, 'Cart not found or API error');
  }

  const resData = await response.json();
  const { data, owner } = PublicCartDetailResponseSchema.parse(resData);

  return {
    data: {
      owner,
      cartData: data,
    },
  };
};
