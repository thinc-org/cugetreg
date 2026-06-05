import { api } from '$lib/api';
import { tryCatch } from '$lib/async-handler';

import { isAxiosError } from 'axios';
import toast from 'svelte-french-toast';

import type {
  CartData,
  CartList,
  ExamScheduleItem,
} from '@cugetreg/zod-schemas/cart-response';
import {
  CartDetailResponseSchema,
  SingleCartItemResponseSchema,
  SingleCartResponseSchema,
} from '@cugetreg/zod-schemas/cart-response';

import { useContextStore } from './stores';

export interface UserCartInterface {
  currentCart: CartData;
  currentCartId: string;
  cartList: CartList;
  exams: ExamScheduleItem[];
}

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
      toast.error('Please login before doing this action.', {
        position: 'bottom-right',
      });
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
 * Cached cart id set whenever useCartActions() is called (i.e. during
 * component initialisation, where getContext is valid).  Lets flushUpdates
 * read the id without touching the Svelte context API.
 */
let cachedCartId: string | undefined;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * The DB stores semester as the Prisma enum value (FIRST / SECOND / SUMMER).
 * The POST /carts endpoint expects the short API form ("1" / "2" / "3").
 */
function reverseSemester(dbValue: string): '1' | '2' | '3' {
  switch (dbValue) {
    case 'FIRST':
      return '1';
    case 'SECOND':
      return '2';
    case 'SUMMER':
    default:
      return '3';
  }
}

// ---------------------------------------------------------------------------
// Flush logic
// ---------------------------------------------------------------------------

const DEBOUNCE_TIME_MS = 1000;

let debounceHandle: ReturnType<typeof setTimeout> | null = null;
let isFlushing = false;

/**
 * Flush all accumulated pending updates to the API.
 * - Cart-level fields → PATCH /carts/:cartId
 * - Per-item fields   → PATCH /carts/items/:itemId  (one request per item)
 *
 * Uses a guard flag so that a slow in-flight flush cannot overlap with the
 * next debounce window. Any changes that arrive while flushing will simply
 * accumulate and be sent in the next flush cycle.
 */
async function flushUpdates(): Promise<void> {
  if (isFlushing) {
    // A flush is already running; reschedule so the new deltas are not lost.
    scheduleFlush();
    return;
  }

  isFlushing = true;

  // Snapshot and clear the buckets atomically so new mutations that arrive
  // during the await calls land in fresh buckets, not in the ones we're
  // about to send.
  const cartPayload = { ...pendingCartUpdate };
  pendingCartUpdate = {};

  const itemPayloads = new Map(pendingItemUpdates);
  pendingItemUpdates.clear();

  // Use the id that was cached during component initialisation.
  // (getUserCartStore calls getContext, which is only valid during init.)
  const currentCartId = cachedCartId;

  console.log('Requesting', { cartPayload, itemPayloads, currentCartId });

  try {
    // 1. Cart-level update
    if (currentCartId && Object.keys(cartPayload).length > 0) {
      console.log('Requesting patch');
      const res = await api.patch(`/carts/${currentCartId}`, cartPayload);
      console.log(res.data);
    }

    // 2. Per-item updates (parallel to keep things fast)
    const itemRequests = Array.from(itemPayloads.entries()).map(
      ([itemId, payload]) => api.patch(`/carts/items/${itemId}`, payload),
    );
    await Promise.all(itemRequests);
  } catch (err) {
    console.error('[user-cart] Failed to sync cart to API:', err);
    // On failure we do NOT re-queue the failed payloads to avoid infinite
    // retry loops.  A future implementation could add exponential back-off.
  } finally {
    isFlushing = false;
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
 * Useful before navigating away or on page unload.
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

  // Keep the module-level cachedCartId in sync so flushUpdates can read it
  // from an async context where getContext() is unavailable.
  userCart.subscribe((s) => {
    cachedCartId = s.currentCartId;
  });

  const pinCart = async () => {
    const snapshot = (() => {
      let s: UserCartInterface | undefined;
      const unsub = userCart.subscribe((v) => {
        s = v;
      });
      unsub();
      return s!;
    })();

    const oldDefault = snapshot.cartList.find((item) => item.isDefault)?.id;
    const newDefault = snapshot.currentCartId;

    try {
      await api.patch(`/carts/${oldDefault}`, {
        isDefault: false,
      });

      await api.patch(`/carts/${newDefault}`, {
        isDefault: true,
      });

      userCart.update((state) => ({
        ...state,
        currentCart: { ...state.currentCart, isDefault: true },
        cartList: state.cartList.map((item) => {
          if (state.currentCartId === item.id)
            return { ...item, isDefault: true };
          else return { ...item, isDefault: false };
        }),
      }));
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * Rename the current timetable optimistically and schedule an API sync.
   */
  const renameCart = (name: string) => {
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
  const updateCartMeta = (fields: UpdateCartFields) => {
    userCart.update((state) => ({
      ...state,
      currentCart: { ...state.currentCart, ...fields },
    }));

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
    const snapshot = (() => {
      let s: UserCartInterface | undefined;
      const unsub = userCart.subscribe((v) => {
        s = v;
      });
      unsub();
      return s!;
    })();

    const { currentCartId } = snapshot;

    try {
      const res = await api.post(`/carts/${currentCartId}/items`, {
        courseNo,
        sectionNo,
      });

      const newItem = SingleCartItemResponseSchema.parse(res.data).data;

      // Fetch the full detail to get the new exam schedule and complete course data

      const detailRes = await api.get(`/carts/${currentCartId}`);
      const detail = CartDetailResponseSchema.parse(detailRes.data).data;

      userCart.update((state) => ({
        ...state,
        currentCart: detail.cart,
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
    const snapshot = (() => {
      let s: UserCartInterface | undefined;
      const unsub = userCart.subscribe((v) => {
        s = v;
      });
      unsub();
      return s!;
    })();

    const { currentCartId } = snapshot;
    if (!currentCartId) return;

    try {
      await api.delete(`/carts/${currentCartId}/items/${itemId}`);

      // Update local state immediately
      userCart.update((state) => ({
        ...state,
        currentCart: {
          ...state.currentCart,
          items: state.currentCart.items.filter((item) => item.id !== itemId),
        },
      }));

      // Fetch the full detail to refresh exams and other derived data
      const detailRes = await api.get(`/carts/${currentCartId}`);
      const detail = CartDetailResponseSchema.parse(detailRes.data).data;

      userCart.update((state) => ({
        ...state,
        currentCart: detail.cart,
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
  const updateCourse = (itemId: string, fields: UpdateCourseFields) => {
    userCart.update((state) => {
      const items = [...state.currentCart.items];
      const index = items.findIndex((item) => item.id === itemId);

      if (index !== -1) {
        // 1. Update fields
        items[index] = { ...items[index], ...fields } as (typeof items)[0];

        // 2. Handle optimistic reordering if prevId/nextId are present
        if ('prevId' in fields || 'nextId' in fields) {
          const [movedItem] = items.splice(index, 1);
          let newIndex: number;

          if (!fields.prevId) {
            newIndex = 0;
          } else {
            const prevIdx = items.findIndex((i) => i.id === fields.prevId);
            newIndex = prevIdx + 1;
          }

          items.splice(newIndex, 0, movedItem);
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

  const copyCart = async (): Promise<string> => {
    const snapshot = (() => {
      let s: UserCartInterface | undefined;
      const unsub = userCart.subscribe((v) => {
        s = v;
      });
      unsub();
      return s!;
    })();

    const { currentCart } = snapshot;

    // 1. Create the new cart shell
    const createRes = await api.post('/carts', {
      academicYear: currentCart.academicYear,
      semester: reverseSemester(currentCart.semester),
      studyProgram: currentCart.studyProgram, // already "S" / "T" / "I"
      name: `Copy of ${currentCart.name}`,
      isDefault: false,
    });

    const newCart = SingleCartResponseSchema.parse(createRes.data).data;
    const newCartId = newCart.id;

    // 2. Copy all items in parallel
    await Promise.all(
      currentCart.items.map((item) =>
        api.post(`/carts/${newCartId}/items`, {
          courseNo: item.courseNo,
          sectionNo: item.sectionNo,
          color: item.color ?? undefined,
          isGraded: item.isGraded,
          expectedGrade: Number(item.expectedGrade),
          hidden: item.hidden,
        }),
      ),
    );

    // 3. Fetch the full detail of the new cart so the store has complete data
    const detailRes = await api.get(`/carts/${newCartId}`);
    const detail = CartDetailResponseSchema.parse(detailRes.data).data;

    // 4. Update the store: push new cart into the list and activate it
    userCart.update((state) => ({
      ...state,
      currentCart: detail.cart,
      currentCartId: newCartId,
      exams: detail.schedule.exams,
      cartList: [
        ...state.cartList,
        {
          id: newCart.id,
          userId: newCart.userId,
          studyProgram: newCart.studyProgram,
          academicYear: newCart.academicYear,
          semester: newCart.semester,
          name: newCart.name,
          visible: newCart.visible,
          isDefault: newCart.isDefault,
          cartOrder: newCart.cartOrder,
          createdAt: newCart.createdAt,
          updatedAt: newCart.updatedAt,
        },
      ],
    }));

    return newCartId;
  };

  const createCart = async (
    name: string,
    // TODO:
    isPublic: boolean,
    studyProgram: 'S' | 'I' | 'T',
    semester: '1' | '2' | '3',
    academicYear: number,
  ) => {
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

    const detailRes = await api.get(`/carts/${newCartId}`);
    const detail = CartDetailResponseSchema.parse(detailRes.data).data;

    userCart.update((state) => ({
      ...state,
      currentCart: detail.cart,
      currentCartId: newCartId,
      exams: detail.schedule.exams,
      cartList: [
        ...state.cartList,
        {
          id: newCart.id,
          userId: newCart.userId,
          studyProgram: newCart.studyProgram,
          academicYear: newCart.academicYear,
          semester: newCart.semester,
          name: newCart.name,
          visible: newCart.visible,
          isDefault: newCart.isDefault,
          cartOrder: newCart.cartOrder,
          createdAt: newCart.createdAt,
          updatedAt: newCart.updatedAt,
        },
      ],
    }));
  };

  const deleteCart = async (): Promise<void> => {
    // Snapshot current state synchronously before any async work
    let snapshot: UserCartInterface | undefined;
    const unsub = userCart.subscribe((v) => {
      snapshot = v;
    });
    unsub();
    const { currentCartId, currentCart, cartList } = snapshot!;

    try {
      // 1. Call the API — will 204 on success
      await api.delete(`/carts/${currentCartId}`);

      // 2. Build the remaining list without the deleted cart
      const remaining = cartList.filter((c) => c.id !== currentCartId);

      if (remaining.length === 0) {
        // No carts left — clear the store to an empty state
        userCart.update((state) => ({
          ...state,
          cartList: [],
          // Keep currentCart/currentCartId as-is; the UI should redirect away
        }));
        return;
      }

      let substituteId: string;
      let updatedList = remaining;

      if (currentCart.isDefault) {
        // Mirror server logic: sort ascending by cartOrder (lexicographic —
        // LexoRank strings sort correctly as plain strings)
        const sorted = [...remaining].sort((a, b) =>
          a.cartOrder < b.cartOrder ? -1 : a.cartOrder > b.cartOrder ? 1 : 0,
        );
        substituteId = sorted[0].id;

        // Mark the substitute as default in the list (the server already did
        // this on its side; we reflect it here so the UI stays consistent)
        updatedList = remaining.map((c) =>
          c.id === substituteId ? { ...c, isDefault: true } : c,
        );
      } else {
        substituteId =
          remaining.find((c) => c.isDefault)?.id ?? remaining[0].id;
      }

      // 4. Fetch the full detail of the substitute so the store has all data
      const detailRes = await api.get(`/carts/${substituteId}`);
      const detail = CartDetailResponseSchema.parse(detailRes.data).data;

      // 5. Update the store in one shot
      userCart.update((state) => ({
        ...state,
        cartList: updatedList,
        currentCart: detail.cart,
        currentCartId: substituteId,
        exams: detail.schedule.exams,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  return {
    renameCart,
    updateCartMeta,
    updateCourse,
    addCourse,
    removeCourse,
    copyCart,
    deleteCart,
    createCart,
    pinCart,
  };
}
