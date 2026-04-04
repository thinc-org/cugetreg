import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';
import axios from 'axios';

import {
  CartData,
  CartDetailResponseSchema,
  CartList,
  type ExamScheduleItem,
  ListCartsResponseSchema,
} from '@cugetreg/zod-schemas/cart-response';

import type { LayoutServerLoad } from './$types';

const API_URL = 'http://localhost:3000/api/v1/carts';

export const load: LayoutServerLoad = async ({ params }) => {
  const [response, error] = await tryCatch(axios.get(API_URL));

  if (error || !response) {
    throw svelteError(500, 'Something went wrong');
  }

  const cartList: CartList = ListCartsResponseSchema.parse(response.data).data;
  const defaultSchedule = cartList.find((item) => item.isDefault);

  const [defaultCartResponse, cartError] = await tryCatch(
    axios.get(API_URL + '/' + defaultSchedule?.id),
  );

  if (cartError || !defaultCartResponse) {
    throw svelteError(500, 'Something went wrong: ' + cartError.message);
  }

  const currentScheduleResponse = CartDetailResponseSchema.parse(
    defaultCartResponse.data,
  ).data;
  const currentCart: CartData = currentScheduleResponse.cart;
  const exams: ExamScheduleItem[] = currentScheduleResponse.schedule.exams;

  const currentCartId = currentCart.id;

  return { cartList, currentCart, currentCartId, exams };
};
