import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';

import { ListCartsResponseSchema } from '@cugetreg/zod-schemas/cart-response';

import type { PageServerLoad } from './$types';

const _DUMMY_USER_ID = {
  id: '63e06682cec32a7209b966b0',
  email: '6532155621@student.chula.ac.th',
};

const API_URL = 'http://localhost:3000/api/v1/carts';

export const load: PageServerLoad = async ({ fetch }) => {
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
