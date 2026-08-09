import { env as privateEnv } from '$env/dynamic/private';
import { env } from '$env/dynamic/public';
import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';

import { ListCartsResponseSchema } from '@cugetreg/zod-schemas/carts-response';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const API_BASE = privateEnv.API_URL
    ? `${privateEnv.API_URL}/api/v1`
    : env.PUBLIC_API_URL;
  const API_URL = `${API_BASE}/carts`;
  const [response, error] = await tryCatch(fetch(API_URL));

  if (error || !response || !response.ok) {
    throw svelteError(404, 'Cart not found or API error');
  }

  const resData = await response.json();
  const data = ListCartsResponseSchema.parse(resData);

  const currentCart = data.data.find((item) => item.isDefault);

  return {
    currentCart,
    cartList: data.data,
  };
};
