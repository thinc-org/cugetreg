import { api } from '$lib/api';

import { isCancel } from 'axios';
import { getContext, setContext } from 'svelte';
import { get, type Writable } from 'svelte/store';
import toast from 'svelte-french-toast';

import {
  type CartData,
  CartDetailResponseSchema,
} from '@cugetreg/zod-schemas/carts-response';

import {
  beginCartSelection,
  flushCartImmediately,
  type UserCartInterface,
} from './user-cart';

const CART_SELECTION_KEY = Symbol('cart-selection');

export class CartSelectionController {
  selectedId = $state('');
  isLoading = $state(false);
  error = $state<unknown>();

  readonly #store: Writable<UserCartInterface>;
  readonly #unsubscribe: () => void;

  #generation = 0;
  #controller?: AbortController;
  #listeners: Array<(cart: CartData) => void> = [];

  constructor(store: Writable<UserCartInterface>) {
    this.#store = store;
    this.#unsubscribe = store.subscribe((state) => {
      if (!this.isLoading) this.selectedId = state.currentCartId;
    });
  }

  async select(cartId: string): Promise<CartData | undefined> {
    if (!cartId) return;

    const current = get(this.#store);
    if (cartId === current.currentCartId && cartId === current.currentCart.id) {
      if (this.isLoading) {
        this.#generation += 1;
        this.#controller?.abort();
        this.#controller = undefined;
        this.isLoading = false;
      }
      this.selectedId = cartId;
      return current.currentCart;
    }

    const generation = ++this.#generation;
    this.#controller?.abort();
    const controller = new AbortController();
    this.#controller = controller;
    this.selectedId = cartId;
    this.isLoading = true;
    this.error = undefined;

    let finishSelection: (() => void) | undefined;
    try {
      finishSelection = await beginCartSelection();
      if (generation !== this.#generation) return;

      await flushCartImmediately();
      if (generation !== this.#generation) return;

      const response = await api.get(`/carts/${cartId}`, {
        signal: controller.signal,
      });
      if (generation !== this.#generation) return;

      const detail = CartDetailResponseSchema.parse(response.data).data;
      this.#store.update((state) => ({
        ...state,
        currentCartId: cartId,
        currentCart: detail.cart,
        exams: detail.schedule.exams,
      }));
      this.selectedId = cartId;
      for (const listener of this.#listeners) listener(detail.cart);

      return detail.cart;
    } catch (error) {
      if (isCancel(error) || generation !== this.#generation) return;

      this.error = error;
      this.selectedId = get(this.#store).currentCartId;
      toast.error('Failed to switch timetable', { position: 'bottom-right' });
      return;
    } finally {
      if (generation === this.#generation) {
        this.#controller = undefined;
        this.isLoading = false;
      }
      finishSelection?.();
    }
  }

  onSelected(listener: (cart: CartData) => void) {
    this.#listeners.push(listener);
    return () => {
      this.#listeners = this.#listeners.filter((item) => item !== listener);
    };
  }

  destroy() {
    this.#generation += 1;
    this.#controller?.abort();
    this.#unsubscribe();
    this.#listeners = [];
  }
}

export function initCartSelectionController(
  store: Writable<UserCartInterface>,
) {
  const controller = new CartSelectionController(store);
  setContext(CART_SELECTION_KEY, controller);
  return controller;
}

export function getCartSelectionController() {
  const controller = getContext<CartSelectionController>(CART_SELECTION_KEY);
  if (!controller) {
    throw new Error('Cart selection controller context is missing');
  }
  return controller;
}
