import { tryCatch } from '$lib/async-handler';

import axios from 'axios';

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

const API_BASE = 'http://localhost:3000/api/v1/carts';
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
      const res = await axios.patch(
        `${API_BASE}/${currentCartId}`,
        cartPayload,
      );
      console.log(res.data);
    }

    // 2. Per-item updates (parallel to keep things fast)
    const itemRequests = Array.from(itemPayloads.entries()).map(
      ([itemId, payload]) =>
        axios.patch(`${API_BASE}/items/${itemId}`, payload),
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

    userCart.update((state) => ({
      ...state,
      currentCart: { ...state.currentCart, isDefault: true },
      cartList: state.cartList.map((item) => {
        if (state.currentCartId === item.id)
          return { ...item, isDefault: true };
        else return { ...item, isDefault: false };
      }),
    }));

    await axios.patch(`${API_BASE}/${oldDefault}`, {
      isDefault: false,
    });

    await axios.patch(`${API_BASE}/${newDefault}`, {
      isDefault: true,
    });
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
    if (!currentCartId) return;

    const res = await axios.post(`${API_BASE}/${currentCartId}/items`, {
      courseNo,
      sectionNo,
    });

    const newItem = SingleCartItemResponseSchema.parse(res.data).data;

    // Fetch the full detail to get the new exam schedule and complete course data
    const detailRes = await axios.get(`${API_BASE}/${currentCartId}`);
    const detail = CartDetailResponseSchema.parse(detailRes.data).data;

    userCart.update((state) => ({
      ...state,
      currentCart: detail.cart,
      exams: detail.schedule.exams,
    }));

    return newItem.id;
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

    await axios.delete(`${API_BASE}/${currentCartId}/items/${itemId}`);

    // Update local state immediately
    userCart.update((state) => ({
      ...state,
      currentCart: {
        ...state.currentCart,
        items: state.currentCart.items.filter((item) => item.id !== itemId),
      },
    }));

    // Fetch the full detail to refresh exams and other derived data
    const detailRes = await axios.get(`${API_BASE}/${currentCartId}`);
    const detail = CartDetailResponseSchema.parse(detailRes.data).data;

    userCart.update((state) => ({
      ...state,
      currentCart: detail.cart,
      exams: detail.schedule.exams,
    }));
  };

  /**
   * Update fields on a course item inside the current timetable optimistically
   * and schedule an API sync.
   *
   * @param itemId - The cart item's database id (CartData.items[n].id)
   * @param fields - Partial set of fields to update
   */
  const updateCourse = (itemId: string, fields: UpdateCourseFields) => {
    userCart.update((state) => ({
      ...state,
      currentCart: {
        ...state.currentCart,
        items: state.currentCart.items.map((item) =>
          item.id === itemId ? ({ ...item, ...fields } as typeof item) : item,
        ),
      },
    }));

    // Merge into this item's pending bucket (last-write-wins per field)
    const existing = pendingItemUpdates.get(itemId) ?? {};
    pendingItemUpdates.set(itemId, { ...existing, ...fields });
    scheduleFlush();
  };

  /**
   * Duplicate the current timetable:
   * 1. Create a new cart with name "Copy of <original name>" and isDefault=false.
   * 2. Copy every course item from the original cart into the new one.
   * 3. Fetch the new cart's full detail and switch the store to it.
   *
   * Returns the new cart's id, or throws on API failure.
   */
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
    const createRes = await axios.post(API_BASE, {
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
        axios.post(`${API_BASE}/${newCartId}/items`, {
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
    const detailRes = await axios.get(`${API_BASE}/${newCartId}`);
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
      axios.post(API_BASE, {
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

    const detailRes = await axios.get(`${API_BASE}/${newCartId}`);
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

  /**
   * Delete the current timetable and switch to a substitute.
   *
   * Flow:
   * 1. DELETE /carts/:currentCartId
   * 2. Remove the deleted cart from cartList.
   * 3. If the deleted cart was the default:
   *    - The server automatically promotes the cart with the lowest cartOrder
   *      as the new default (same logic mirrored here client-side).
   *    - Fetch that cart's full detail and activate it.
   * 4. If it was not the default, switch to whichever cart is currently
   *    marked default in the remaining list.
   *
   * Throws on API failure so callers can surface an error to the user.
   */
  const deleteCart = async (): Promise<void> => {
    // Snapshot current state synchronously before any async work
    let snapshot: UserCartInterface | undefined;
    const unsub = userCart.subscribe((v) => {
      snapshot = v;
    });
    unsub();
    const { currentCartId, currentCart, cartList } = snapshot!;

    // 1. Call the API — will 204 on success
    await axios.delete(`${API_BASE}/${currentCartId}`);

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

    // 3. Find the substitute cart using the same rule as the server:
    //    if deleted was default → lowest cartOrder in remaining list;
    //    otherwise             → whichever is already marked default.
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
      substituteId = remaining.find((c) => c.isDefault)?.id ?? remaining[0].id;
    }

    // 4. Fetch the full detail of the substitute so the store has all data
    const detailRes = await axios.get(`${API_BASE}/${substituteId}`);
    const detail = CartDetailResponseSchema.parse(detailRes.data).data;

    // 5. Update the store in one shot
    userCart.update((state) => ({
      ...state,
      cartList: updatedList,
      currentCart: detail.cart,
      currentCartId: substituteId,
      exams: detail.schedule.exams,
    }));
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
