import type { CartData, CartList } from "@cugetreg/zod-schemas/cart-response";
import { useContextStore } from "./stores";

export interface UserCartInterface {
    currentCart?: CartData,
    cartList?: CartList
};

const CART_KEY = Symbol('cart')

export const {
    initStore: initUserCartStore,
    getStore: getUserCartStore
} = useContextStore<UserCartInterface>(CART_KEY);
