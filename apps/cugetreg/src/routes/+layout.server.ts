import { tryCatch } from '$lib/async-handler';
import type { UserCartInterface } from '$lib/stores/user-cart';

import { error as svelteError } from '@sveltejs/kit';

import {
  CartData,
  CartDetailResponseSchema,
  type CartSchema,
  type ExamScheduleItem,
  ListCartsResponseSchema,
} from '@cugetreg/zod-schemas/carts-response';

import type { LayoutServerLoad } from './$types';

const API_URL = 'http://localhost:3000/api/v1/carts';

export const load: LayoutServerLoad = () => {
  return { cart: loadCart() };
};

async function loadCart() {
  // const [response, error] = await tryCatch(axios.get(API_URL));
  //
  // if (error || !response) {
  //   throw svelteError(500, 'Something went wrong');
  // }
  //
  const response = await fetch(`${API_URL}`);

  if (!response || !response.ok) {
    throw svelteError(500, 'Something went wrong fetching carts');
  }

  const resData = await response.json();
  const cartList: CartSchema[] = ListCartsResponseSchema.parse(resData).data;
  const defaultSchedule = cartList.find((item) => item.isDefault);

  let cartDetailData: any;

  if (!defaultSchedule) {
    // 1. No default schedule exists in the list - Create one
    const [createRes, createErr] = await tryCatch(
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          academicYear: 2566,
          semester: 'SECOND',
          studyProgram: 'S',
          name: 'My Timetable',
          isDefault: true,
        }),
      }),
    );

    if (createErr || !createRes || !createRes.ok) {
      const errorData = createRes
        ? await createRes.json().catch(() => ({}))
        : {};
      console.error(errorData);
      throw svelteError(
        500,
        `Failed to create default timetable: ${JSON.stringify(errorData)}`,
      );
    }

    const createData = await createRes.json();

    // Refresh the detail for this new cart
    const [detailRes, detailErr] = await tryCatch(
      fetch(`${API_URL}/${createData.data.id}`),
    );

    if (detailErr || !detailRes || !detailRes.ok) {
      throw svelteError(500, 'Failed to fetch new timetable details');
    }
    cartDetailData = await detailRes.json();

    // Add the new cart to the list so the UI is consistent
    cartList.push(createData.data);
  } else {
    // 2. Default schedule found in list - Try to fetch its details
    const [detailRes, detailErr] = await tryCatch(
      fetch(`${API_URL}/${defaultSchedule.id}`),
    );

    if (detailRes?.status === 404) {
      // Handle the rare case where list has it but detail 404s
      const [createRes, createErr] = await tryCatch(
        fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            academicYear: 2566,
            semester: 2,
            studyProgram: 'S',
            name: 'My Schedule',
            isDefault: true,
          }),
        }),
      );

      if (createErr || !createRes || !createRes.ok) {
        throw svelteError(500, 'Failed to recreate missing default timetable');
      }

      const createData = await createRes.json();
      const [newDetailRes, newDetailErr] = await tryCatch(
        fetch(`${API_URL}/${createData.data.id}`),
      );
      if (newDetailErr || !newDetailRes || !newDetailRes.ok) {
        throw svelteError(500, 'Failed to fetch recreated timetable details');
      }
      cartDetailData = await newDetailRes.json();
    } else if (detailErr || !detailRes || !detailRes.ok) {
      throw svelteError(
        500,
        'Something went wrong fetching timetable: ' +
          (detailErr?.message || detailRes?.statusText),
      );
    } else {
      cartDetailData = await detailRes.json();
    }
  }

  const currentScheduleResponse =
    CartDetailResponseSchema.parse(cartDetailData).data;
  const currentCart: CartData = currentScheduleResponse.cart;
  const exams: ExamScheduleItem[] = currentScheduleResponse.schedule.exams;
  const currentCartId = currentCart.id;

  return {
    cartList,
    currentCart,
    currentCartId,
    exams,
  } as UserCartInterface;
}
