import axios from "axios";
import { error as svelteError } from '@sveltejs/kit'
import type { PageServerLoad } from "./$types";
import { tryCatch } from "$lib/async-handler";
import { ListCartsResponseSchema } from "@cugetreg/zod-schemas/cart-response";

const DUMMY_USER_ID = {
  id: "63e06682cec32a7209b966b0",
  email: "6532155621@student.chula.ac.th",
};

const API_URL = "http://localhost:3000/api/v1/carts";

export const load: PageServerLoad = async () => {
    const [response, error] = await tryCatch(axios.get(API_URL));

    if (error || !response) {
        throw svelteError(404, 'Cart not found or API error')
    }

    const data = ListCartsResponseSchema.parse(response.data);

    const currentCart = data.data.find(item => item.isDefault)

    return {
        currentCart,
        cartList: data.data
    }
}
