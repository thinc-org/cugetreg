import { api } from '$lib/api';
import { tryCatch } from '$lib/async-handler';

import { isAxiosError } from 'axios';
import { get, type Writable } from 'svelte/store';
import toast from 'svelte-french-toast';

import { courseColorVariants } from '@cugetreg/utils/constants';
import {
  ImportPublicCartResponseSchema,
  type PublicCartDetail,
} from '@cugetreg/zod-schemas';
import type {
  CartData,
  CartSchema,
  ExamScheduleItem,
} from '@cugetreg/zod-schemas/carts-response';
import {
  CartDetailResponseSchema,
  SingleCartItemResponseSchema,
  SingleCartResponseSchema,
} from '@cugetreg/zod-schemas/carts-response';
import type {
  Semester,
  StudyProgram,
  Visible,
} from '@cugetreg/zod-schemas/constants';

import { loginPopupState } from './login-popup.svelte';
import { useContextStore } from './stores';

export interface UserCartInterface {
  currentCart: CartData;
  currentCartId: string;
  cartList: CartSchema[];
  exams: ExamScheduleItem[];
}

const showError = (message: string) =>
  toast.error(message, { position: 'bottom-right' });

/**
 * Context key for the cart data promise streamed from the root layout load.
 * Components can `{#await}` it to show a spinner while the cart is still being
 * fetched, without blocking the rest of the page from rendering.
 */
export const CART_PROMISE_KEY = Symbol('cart-promise');
export type CartPromise = Promise<UserCartInterface>;

export interface UpdateCartFields {
  name?: string;
  visible?: string;
  isDefault?: boolean;
  prevId?: string;
  nextId?: string;
}

export interface UpdateCourseFields {
  sectionNo?: number;
  color?: string;
  hidden?: boolean;
  isGraded?: boolean;
  expectedGrade?: number;
  prevId?: string;
  nextId?: string;
}

const CART_KEY = Symbol('cart');

export const { initStore: initUserCartStore, getStore: getUserCartStore } =
  useContextStore<UserCartInterface>(CART_KEY);

function handleError(error: any) {
  if (isAxiosError(error)) {
    if (error.status === 401) {
      loginPopupState.show = true;
      return;
    }

    toast.error('Something went wrong', { position: 'bottom-right' });
    return;
  }

  toast.error('Something went wrong', { position: 'bottom-right' });
}

// ---------------------------------------------------------------------------
// Pending-update buckets
// These live outside the store so they survive independent of Svelte's
// reactivity system and can be read at flush time.
// ---------------------------------------------------------------------------

/** Accumulated cart-level field changes (last-write-wins per field). */
let pendingCartUpdate: UpdateCartFields = {};

/**
 * Accumulated course-item changes keyed by itemId.
 * Each entry is a partial delta (last-write-wins per field within an item).
 */
const pendingItemUpdates = new Map<string, UpdateCourseFields>();

/**
 * Cached reference to the userCart writable, set in useCartActions().
 * Lets flushUpdates read the store from an async context where getContext()
 * is unavailable, and lets us use get() instead of a leaky subscription.
 */
let cachedStore: Writable<UserCartInterface> | undefined;

// ---------------------------------------------------------------------------
// Flush logic
// ---------------------------------------------------------------------------

const DEBOUNCE_TIME_MS = 1000;

let debounceHandle: ReturnType<typeof setTimeout> | null = null;
let isFlushing = false;
let activeCartSelection: Promise<void> | null = null;
let activeCartMutations = 0;
let cartMutationsIdle: Promise<void> = Promise.resolve();
let resolveCartMutationsIdle: (() => void) | null = null;

/**
 * Tracks the in-flight flush promise so that flushCartImmediately callers
 * can await the currently-running flush before proceeding.
 */
let flushPromise: Promise<void> | null = null;

export async function beginCartSelection(): Promise<() => void> {
  while (activeCartMutations > 0) {
    await cartMutationsIdle;
  }

  let resolveSelection: () => void;
  const selection = new Promise<void>((resolve) => {
    resolveSelection = resolve;
  });
  activeCartSelection = selection;

  return () => {
    resolveSelection();
    if (activeCartSelection === selection) activeCartSelection = null;
  };
}

async function waitForCartSelection(): Promise<void> {
  while (activeCartSelection) {
    await activeCartSelection;
  }
}

async function runCartMutation<T>(mutation: () => T | Promise<T>) {
  while (true) {
    await waitForCartSelection();
    if (activeCartSelection) continue;

    if (activeCartMutations === 0) {
      cartMutationsIdle = new Promise<void>((resolve) => {
        resolveCartMutationsIdle = resolve;
      });
    }
    activeCartMutations += 1;
    break;
  }

  try {
    return await mutation();
  } finally {
    activeCartMutations -= 1;
    if (activeCartMutations === 0) {
      resolveCartMutationsIdle?.();
      resolveCartMutationsIdle = null;
    }
  }
}

/**
 * Flush all accumulated pending updates to the API.
 * - Cart-level fields → PATCH /carts/:cartId
 * - Per-item fields   → PATCH /carts/items/:itemId  (one request per item)
 *
 * Uses a promise-based queue so that:
 *  1. Callers can await the in-flight flush and have their changes picked
 *     up in a subsequent fresh cycle (fixes #5).
 *  2. On API failure the store is reconciled from the server (fixes #3).
 */
async function flushUpdates(): Promise<void> {
  if (isFlushing) {
    // A flush is already running — wait for it, then run a fresh cycle so
    // any changes that accumulated during the await are sent afterwards.
    await flushPromise;
    return flushUpdates();
  }

  isFlushing = true;

  // Snapshot and clear the buckets atomically so new mutations that arrive
  // during the await calls land in fresh buckets, not in the ones we're
  // about to send.
  const cartPayload = { ...pendingCartUpdate };
  pendingCartUpdate = {};

  const itemPayloads = new Map(pendingItemUpdates);
  pendingItemUpdates.clear();

  const currentCartId = cachedStore
    ? get(cachedStore)?.currentCartId
    : undefined;

  const execute = async (): Promise<void> => {
    // 1. Cart-level update
    if (currentCartId && Object.keys(cartPayload).length > 0) {
      await api.patch(`/carts/${currentCartId}`, cartPayload);
    }

    // 2. Per-item updates (parallel to keep things fast)
    const itemRequests = Array.from(itemPayloads.entries()).map(
      ([itemId, payload]) => api.patch(`/carts/items/${itemId}`, payload),
    );
    await Promise.all(itemRequests);
  };

  flushPromise = execute();

  try {
    await flushPromise;
  } catch (err) {
    console.error('[user-cart] Failed to sync cart to API:', err);

    // On failure, reconcile the store from the server so the UI doesn't
    // hang on stale optimistic updates.
    if (currentCartId && cachedStore) {
      try {
        const detailRes = await api.get(`/carts/${currentCartId}`);
        const detail = CartDetailResponseSchema.parse(detailRes.data).data;
        cachedStore.update((state) => ({
          ...state,
          currentCart: detail.cart,
          exams: detail.schedule.exams,
        }));
      } catch {
        // Reload failed — give up, the UI will be stale until next refresh
      }
    }
  } finally {
    isFlushing = false;
    flushPromise = null;
  }
}

/**
 * Restart the debounce timer.  Called after every local state mutation.
 */
function scheduleFlush(): void {
  if (debounceHandle !== null) {
    clearTimeout(debounceHandle);
  }
  debounceHandle = setTimeout(() => {
    debounceHandle = null;
    flushUpdates();
  }, DEBOUNCE_TIME_MS);
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/**
 * Cancel any pending debounce and immediately flush all accumulated updates.
 * Useful before navigating away, or before async cart mutations that need
 * a clean server-state baseline.
 */
export async function flushCartImmediately(): Promise<void> {
  if (debounceHandle !== null) {
    clearTimeout(debounceHandle);
    debounceHandle = null;
  }
  await flushUpdates();
}

// ---------------------------------------------------------------------------
// Cart actions
// ---------------------------------------------------------------------------

export function useCartActions() {
  const userCart = getUserCartStore();

  // Cache the store reference so flushUpdates can read it from async
  // contexts where Svelte's getContext() is unavailable.
  cachedStore = userCart;

  const pinCart = async () => {
    await waitForCartSelection();
    const snapshot = get(userCart);
    if (!snapshot) return;

    try {
      await api.patch(`/carts/${snapshot.currentCartId}/pin`);

      userCart.update((state) => ({
        ...state,
        currentCart: { ...state.currentCart, isDefault: true },
        cartList: state.cartList.map((item) =>
          state.currentCartId === item.id
            ? { ...item, isDefault: true }
            : { ...item, isDefault: false },
        ),
      }));
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Rename the current timetable optimistically and schedule an API sync.
   */
  const renameCart = async (name: string) => {
    await waitForCartSelection();
    console.log(`renaming to ${name}`);
    userCart.update((state) => ({
      ...state,
      currentCart: { ...state.currentCart, name },
      cartList: state.cartList.map((item) =>
        item.id === state.currentCartId ? { ...item, name } : item,
      ),
    }));

    // Merge into the cart-level pending bucket
    pendingCartUpdate = { ...pendingCartUpdate, name };
    scheduleFlush();
  };

  /**
   * Update arbitrary cart-level metadata fields optimistically and schedule
   * an API sync.  Useful for toggling visibility, changing order, etc.
   */
  const updateCartMeta = async (fields: UpdateCartFields) => {
    await waitForCartSelection();
    userCart.update((state) => {
      let result = {
        ...state,
        currentCart: { ...state.currentCart, ...fields },
      };

      // Optimistically reorder cartList when prevId/nextId is present,
      // so the list reflects the new order immediately.
      if ('prevId' in fields || 'nextId' in fields) {
        const currentIdx = state.cartList.findIndex(
          (c) => c.id === state.currentCartId,
        );
        if (currentIdx !== -1) {
          const cartList = [...state.cartList];
          const [moved] = cartList.splice(currentIdx, 1);
          const newIndex = !fields.prevId
            ? 0
            : cartList.findIndex((c) => c.id === fields.prevId) + 1;
          cartList.splice(newIndex, 0, moved);
          result = { ...result, cartList };
        }
      }

      return result;
    });

    pendingCartUpdate = { ...pendingCartUpdate, ...fields };
    scheduleFlush();
  };

  /**
   * Add a course to the current timetable.
   *
   * @param courseNo - The course number (e.g. "2110101")
   * @param sectionNo - The section number
   */
  const addCourse = async (courseNo: string, sectionNo: number) => {
    await waitForCartSelection();
    // Flush any pending optimistic mutations (rename, color change, etc.)
    // so the server state matches local state before the destructive GET.
    await flushCartImmediately();

    const snapshot = get(userCart);
    const { currentCartId } = snapshot ?? {};
    if (!currentCartId) return;

    try {
      const colors = Object.keys(courseColorVariants).slice(1, -1);
      const color = colors[Number(courseNo) % colors.length];
      const res = await api.post(`/carts/${currentCartId}/items`, {
        courseNo,
        sectionNo,
        color,
      });

      const newItem = SingleCartItemResponseSchema.parse(res.data).data;

      // Fetch the full detail to get the new exam schedule and complete course data
      const detailRes = await api.get(`/carts/${currentCartId}`);
      const detail = CartDetailResponseSchema.parse(detailRes.data).data;

      // Surgical merge: only update items and exams, preserving any fields
      // on currentCart that may have changed optimistically.
      userCart.update((state) => ({
        ...state,
        currentCart: {
          ...state.currentCart,
          items: detail.cart.items,
        },
        exams: detail.schedule.exams,
      }));

      toast.success('Course added successfully', { position: 'bottom-right' });

      return newItem.id;
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Remove a course from the current timetable.
   *
   * @param itemId - The cart item's database id
   */
  const removeCourse = async (itemId: string) => {
    await waitForCartSelection();
    // Flush any pending optimistic mutations first.
    await flushCartImmediately();

    const snapshot = get(userCart);
    const { currentCartId } = snapshot ?? {};
    if (!currentCartId) return;

    try {
      await api.delete(`/carts/${currentCartId}/items/${itemId}`);

      // Fetch the full detail to refresh exams and other derived data
      const detailRes = await api.get(`/carts/${currentCartId}`);
      const detail = CartDetailResponseSchema.parse(detailRes.data).data;

      // Surgical merge: only update items and exams, preserving any
      // fields on currentCart that may have changed optimistically.
      userCart.update((state) => ({
        ...state,
        currentCart: {
          ...state.currentCart,
          items: detail.cart.items,
        },
        exams: detail.schedule.exams,
      }));

      toast.success('Course removed successfully.', {
        position: 'bottom-right',
      });
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Update fields on a course item inside the current timetable optimistically
   * and schedule an API sync.
   *
   * @param itemId - The cart item's database id (CartData.items[n].id)
   * @param fields - Partial set of fields to update
   */
  const updateCourse = async (itemId: string, fields: UpdateCourseFields) => {
    await waitForCartSelection();
    userCart.update((state) => {
      // 1. Apply field updates
      const items: CartData['items'] = state.currentCart.items.map((item) =>
        item.id === itemId
          ? ({ ...item, ...fields } as CartData['items'][0])
          : item,
      );

      if ('prevId' in fields || 'nextId' in fields) {
        const index = items.findIndex((i) => i.id === itemId);
        if (index !== -1) {
          const [moved] = items.splice(index, 1);
          const newIndex = !fields.prevId
            ? 0
            : items.findIndex((i) => i.id === fields.prevId) + 1;
          items.splice(newIndex, 0, moved);
        }
      }

      return {
        ...state,
        currentCart: {
          ...state.currentCart,
          items,
        },
      };
    });

    // Merge into this item's pending bucket (last-write-wins per field)
    const existing = pendingItemUpdates.get(itemId) ?? {};
    pendingItemUpdates.set(itemId, { ...existing, ...fields });
    scheduleFlush();
  };

  const updateCourseImmediately = async (
    itemId: string,
    fields: UpdateCourseFields,
  ): Promise<boolean> => {
    await waitForCartSelection();
    await flushCartImmediately();

    try {
      await api.patch(`/carts/items/${itemId}`, fields);
      userCart.update((state) => ({
        ...state,
        currentCart: {
          ...state.currentCart,
          items: state.currentCart.items.map((item) =>
            item.id === itemId
              ? ({ ...item, ...fields } as CartData['items'][0])
              : item,
          ),
        },
      }));
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  const copyCart = async (): Promise<string> => {
    await waitForCartSelection();
    const snapshot = get(userCart);
    if (!snapshot) return '';
    const { currentCartId, currentCart } = snapshot;

    try {
      // Flush pending optimistic mutations so the server-side snapshot
      // matches the latest local state before duplicating.
      await flushCartImmediately();

      const dupRes = await api.post(`/carts/${currentCartId}/duplicate`, {
        name: `Copy of ${currentCart.name}`,
      });
      const newCart = SingleCartResponseSchema.parse(dupRes.data).data;
      const newCartId = newCart.id;

      // Fetch the full detail so the store has exams and schedule data
      const detailRes = await api.get(`/carts/${newCartId}`);
      const detail = CartDetailResponseSchema.parse(detailRes.data).data;

      userCart.update((state) => ({
        ...state,
        currentCart: detail.cart,
        currentCartId: newCartId,
        exams: detail.schedule.exams,
        cartList: [...state.cartList, newCart],
      }));

      return newCartId;
    } catch (error) {
      handleError(error);
      return '';
    }
  };

  const createCart = async (
    name: string,
    // TODO:
    isPublic: boolean,
    studyProgram: StudyProgram,
    semester: Semester,
    academicYear: number,
  ) => {
    await waitForCartSelection();
    const [response, error] = await tryCatch(
      api.post('/carts', {
        academicYear,
        semester,
        studyProgram,
        name,
        isDefault: false,
      }),
    );

    if (error || !response) {
      console.error(error);
      return;
    }

    const newCart = SingleCartResponseSchema.parse(response.data).data;
    const newCartId = newCart.id;

    // Try to fetch the full detail — degrade gracefully if it fails so the
    // cart isn't orphaned from the store.
    let cartData: CartData | undefined;
    let examsData: ExamScheduleItem[] | undefined;
    try {
      const detailRes = await api.get(`/carts/${newCartId}`);
      const detail = CartDetailResponseSchema.parse(detailRes.data).data;
      cartData = detail.cart;
      examsData = detail.schedule.exams;
    } catch {
      toast.error('Created cart but failed to load details', {
        position: 'bottom-right',
      });
    }

    userCart.update((state) => ({
      ...state,
      currentCart:
        cartData ??
        ({
          ...newCart,
          items: [],
        } as unknown as CartData),
      currentCartId: newCartId,
      exams: examsData ?? [],
      cartList: [...state.cartList, newCart],
    }));
  };

  const deleteCart = async (cartId?: string): Promise<boolean> => {
    await waitForCartSelection();
    const snapshot = get(userCart);
    if (!snapshot) return false;
    const { currentCartId, currentCart } = snapshot;
    const targetId = cartId ?? currentCartId;
    const isCurrentCart = targetId === currentCartId;

    // Only flush pending changes when deleting the active cart — the
    // pending buckets reference the current cart by definition.
    if (isCurrentCart) {
      await flushCartImmediately();
    }

    try {
      await api.delete(`/carts/${targetId}`);

      // Clear pending state only if this was the current cart
      if (isCurrentCart) {
        pendingCartUpdate = {};
        pendingItemUpdates.clear();
        if (debounceHandle !== null) {
          clearTimeout(debounceHandle);
          debounceHandle = null;
        }
      }

      // --- Non-current cart: simple list removal, no substitute ---
      if (!isCurrentCart) {
        userCart.update((state) => ({
          ...state,
          cartList: state.cartList.filter((c) => c.id !== targetId),
        }));
        return true;
      }

      // --- Current cart: pick a substitute ---
      const currentState = get(userCart);
      if (!currentState) return true;

      const remaining = currentState.cartList.filter((c) => c.id !== targetId);

      if (remaining.length === 0) {
        userCart.update((state) => ({
          ...state,
          cartList: [],
        }));
        return true;
      }

      let substituteId: string;
      let substituteIsDefault = false;

      if (currentCart.isDefault) {
        // Mirror server logic: sort ascending by cartOrder (LexoRank
        // strings sort correctly as plain strings)
        const sorted = [...remaining].sort((a, b) =>
          a.cartOrder < b.cartOrder ? -1 : a.cartOrder > b.cartOrder ? 1 : 0,
        );
        substituteId = sorted[0].id;
        substituteIsDefault = true;
      } else {
        substituteId =
          remaining.find((c) => c.isDefault)?.id ?? remaining[0].id;
      }

      // Fetch the full detail of the substitute
      let detail;
      try {
        const detailRes = await api.get(`/carts/${substituteId}`);
        detail = CartDetailResponseSchema.parse(detailRes.data).data;
      } catch {
        // If the fetch fails, still remove the cart from the list but don't
        // overwrite currentCart — the next data refresh will fill it in.
        userCart.update((state) => ({
          ...state,
          cartList: state.cartList.filter((c) => c.id !== targetId),
        }));
        return true;
      }

      // Update the store — compute remaining from the current state in
      // the callback so concurrently-added carts are not lost.
      userCart.update((state) => {
        // Freshly compute remaining from the latest state
        const freshRemaining = state.cartList.filter((c) => c.id !== targetId);

        if (freshRemaining.length === 0) {
          return { ...state, cartList: [] };
        }

        // If the substitute we fetched was concurrently deleted too,
        // just remove our cart and leave state otherwise intact.
        if (!freshRemaining.some((c) => c.id === substituteId)) {
          return { ...state, cartList: freshRemaining };
        }

        const updatedList = freshRemaining.map((c) =>
          c.id === substituteId && substituteIsDefault
            ? { ...c, isDefault: true }
            : c,
        );

        return {
          ...state,
          cartList: updatedList,
          currentCart: detail.cart,
          currentCartId: substituteId,
          exams: detail.schedule.exams,
        };
      });

      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  const importCart = async (cartDetail: PublicCartDetail) => {
    await waitForCartSelection();
    const cart = cartDetail.cart;
    const exams = cartDetail.schedule.exams;
    const res = await api.post(`/public/carts/${cart.id}/import`, {
      name: cart.name,
    });
    const { cart: importedCart } = ImportPublicCartResponseSchema.parse(
      res.data,
    ).data;

    const newCartData: CartData = {
      id: importedCart.id,
      name: importedCart.name,
      studyProgram: importedCart.studyProgram,
      academicYear: importedCart.academicYear,
      semester: importedCart.semester,
      visible: importedCart.visible,
      isDefault: importedCart.isDefault,
      cartOrder: importedCart.cartOrder,
      items: cart.items.map((item) => ({
        ...item,
        isGraded: false,
        expectedGrade: '0',
      })),
      activityItems: [],
    };

    userCart.update((state) => ({
      ...state,
      currentCartId: importedCart.id,
      currentCart: newCartData,
      exams,
      cartList: [...state.cartList, importedCart],
    }));
  };

  const changeCartVisibility = async (
    cartId: string,
    visible: Visible,
  ): Promise<boolean> => {
    await waitForCartSelection();
    try {
      await api.patch(`/carts/${cartId}`, { visible });

      userCart.update((state) => ({
        ...state,
        cartList: state.cartList.map((item) =>
          item.id === cartId ? { ...item, visible } : item,
        ),
        currentCart:
          state.currentCartId === cartId
            ? { ...state.currentCart, visible }
            : state.currentCart,
      }));
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  return {
    renameCart: (name: string) => runCartMutation(() => renameCart(name)),
    updateCartMeta: (fields: UpdateCartFields) =>
      runCartMutation(() => updateCartMeta(fields)),
    updateCourse: (itemId: string, fields: UpdateCourseFields) =>
      runCartMutation(() => updateCourse(itemId, fields)),
    updateCourseImmediately: (itemId: string, fields: UpdateCourseFields) =>
      runCartMutation(() => updateCourseImmediately(itemId, fields)),
    addCourse: (courseNo: string, sectionNo: number) =>
      runCartMutation(() => addCourse(courseNo, sectionNo)),
    removeCourse: (itemId: string) =>
      runCartMutation(() => removeCourse(itemId)),
    copyCart: () => runCartMutation(copyCart),
    deleteCart: (cartId?: string) => runCartMutation(() => deleteCart(cartId)),
    createCart: (
      name: string,
      isPublic: boolean,
      studyProgram: StudyProgram,
      semester: Semester,
      academicYear: number,
    ) =>
      runCartMutation(() =>
        createCart(name, isPublic, studyProgram, semester, academicYear),
      ),
    pinCart: () => runCartMutation(pinCart),
    importCart: (cartDetail: PublicCartDetail) =>
      runCartMutation(() => importCart(cartDetail)),
    changeCartVisibility: (cartId: string, visible: Visible) =>
      runCartMutation(() => changeCartVisibility(cartId, visible)),
  };
}
