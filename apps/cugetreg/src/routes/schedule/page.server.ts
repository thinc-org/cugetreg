import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';
import axios from 'axios';

import { ListCartsResponseSchema } from '@cugetreg/zod-schemas/cart-response';

import type { PageServerLoad } from './$types';

const API_URL = 'http://localhost:3000/api/v1/carts';

export const load: PageServerLoad = async () => {
  const [response, error] = await tryCatch(axios.get(API_URL));

  if (error || !response) {
    throw svelteError(404, 'Cart not found or API error');
  }

  const data = ListCartsResponseSchema.parse(response.data);

  const currentCart = data.data.find((item) => item.isDefault);

  return {
    currentCart,
    cartList: data.data,
  };
};
