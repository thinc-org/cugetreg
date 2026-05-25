import { tryCatch } from '$lib/async-handler';

import { error as svelteError } from '@sveltejs/kit';
import axios from 'axios';

// import { type CreateCartBodySchema } from '@cugetreg/zod-schemas/cart';
import {
  CartData,
  CartDetailResponseSchema,
  CartList,
  type ExamScheduleItem,
  ListCartsResponseSchema,
} from '@cugetreg/zod-schemas/cart-response';

import type { LayoutServerLoad } from './$types';

const API_URL = 'http://localhost:3000/api/v1/carts';

export const load: LayoutServerLoad = async ({ params: _params }) => {
  const [response, error] = await tryCatch(
    axios.get(API_URL, {
      params: {
        academicYear: 2566,
        semester: 'SECOND',
        studyProgram: 'S',
      },
    }),
  );

  if (error || !response) {
    throw svelteError(500, 'Something went wrong');
  }

  const cartList: CartList = ListCartsResponseSchema.parse(response.data).data;
  const defaultSchedule = cartList.find((item) => item.isDefault);

  let cartDetailData: any;

  if (!defaultSchedule) {
    // 1. No default schedule exists in the list - Create one
    const [createRes, createErr] = await tryCatch(
      axios.post(API_URL, {
        academicYear: 2566,
        semester: 'SECOND',
        studyProgram: 'S',
        name: 'My Timetable',
        isDefault: true,
      }),
    );

    if (createErr || !createRes) {
      console.error(createErr.response?.data);
      throw svelteError(
        500,
        `Failed to create default timetable: ${createErr.response?.data}`,
      );
    }

    // Refresh the detail for this new cart
    const [detailRes, detailErr] = await tryCatch(
      axios.get(`${API_URL}/${createRes.data.data.id}`),
    );

    if (detailErr || !detailRes) {
      throw svelteError(500, 'Failed to fetch new timetable details');
    }
    cartDetailData = detailRes.data;

    // Add the new cart to the list so the UI is consistent
    cartList.push(createRes.data.data);
  } else {
    // 2. Default schedule found in list - Try to fetch its details
    const [detailRes, detailErr] = await tryCatch(
      axios.get(`${API_URL}/${defaultSchedule.id}`),
    );

    if (detailRes?.status === 404) {
      // Handle the rare case where list has it but detail 404s
      const [createRes, createErr] = await tryCatch(
        axios.post(API_URL, {
          academicYear: 2566,
          semester: 2,
          studyProgram: 'S',
          name: 'My Schedule',
          isDefault: true,
        }),
      );

      if (createErr || !createRes) {
        throw svelteError(500, 'Failed to recreate missing default timetable');
      }

      const [newDetailRes, newDetailErr] = await tryCatch(
        axios.get(`${API_URL}/${createRes.data.data.id}`),
      );
      if (newDetailErr || !newDetailRes) {
        throw svelteError(500, 'Failed to fetch recreated timetable details');
      }
      cartDetailData = newDetailRes.data;
    } else if (detailErr || !detailRes) {
      throw svelteError(
        500,
        'Something went wrong fetching timetable: ' + detailErr?.message,
      );
    } else {
      cartDetailData = detailRes.data;
    }
  }

  const currentScheduleResponse =
    CartDetailResponseSchema.parse(cartDetailData).data;
  const currentCart: CartData = currentScheduleResponse.cart;
  const exams: ExamScheduleItem[] = currentScheduleResponse.schedule.exams;
  const currentCartId = currentCart.id;

  return { cartList, currentCart, currentCartId, exams };
};
