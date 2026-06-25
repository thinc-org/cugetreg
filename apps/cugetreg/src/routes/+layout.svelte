<script lang="ts">
  import '$lib/styles/app.css';

  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { tryCatch } from '$lib/async-handler';
  import {
    handleGoogleLogin,
    handleGoogleLogout,
    useSession,
  } from '$lib/auth-client';
  import { loginPopupState } from '$lib/stores/login-popup.svelte';
  import { searchState } from '$lib/stores/search.svelte';
  import {
    CART_PROMISE_KEY,
    initUserCartStore,
    useCartActions,
    type UserCartInterface,
  } from '$lib/stores/user-cart';

  import { setContext, type Snippet } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast';

  import { Modal } from '@cugetreg/ui/atoms/modal';
  import {
    CreateTimetable,
    type TimetableMetaData,
  } from '@cugetreg/ui/organisms/create-timetable';
  import { LoginPopup } from '@cugetreg/ui/organisms/login-popup';
  import { Navbar } from '@cugetreg/ui/organisms/navbar';
  import { CartDetailResponseSchema } from '@cugetreg/zod-schemas/carts-response';

  import type { LayoutData } from './$types';

  const session = useSession();

  $effect(() => {
    const errorMsg = page.url.searchParams.get('error');
    if (!errorMsg) return;

    if (errorMsg === 'no_session') {
      loginPopupState.show = true;
    } else {
      const messages: Record<string, string> = {
        non_chula_email: 'Please login with Chula email.',
      };
      toast.error(messages[errorMsg] ?? 'Something went wrong.', {
        position: 'bottom-right',
      });
    }

    const cleanUrl = new URL(page.url);
    cleanUrl.searchParams.delete('error');
    goto(cleanUrl, { replaceState: true, keepFocus: true });
  });

  let {
    data,
    children,
  }: {
    data: LayoutData;
    children?: Snippet;
  } = $props();

  const EMPTY_CART: UserCartInterface = {
    currentCart: {
      id: '',
      name: '',
      studyProgram: '',
      academicYear: 0,
      semester: '',
      visible: '',
      isDefault: false,
      cartOrder: '',
      items: [],
    },
    currentCartId: '',
    cartList: [],
    exams: [],
  };

  const userCart = initUserCartStore(EMPTY_CART);

  const cartPromise = (() => data.cart)();

  cartPromise.then(
    (cart) => {
      if (cart) userCart.set(cart);
      return cart;
    },
    (err) => console.error('[layout] failed to load cart:', err),
  );

  setContext(CART_PROMISE_KEY, cartPromise);

  let lastFetchedId = '';

  $effect(() => {
    const currentId = $userCart.currentCartId;

    if (!currentId || currentId === lastFetchedId) return;

    const fetchCurrentSchedule = async (id: string) => {
      const [response, error] = await tryCatch(
        api.get(`/carts/${id}`, {
          headers: {
            Authorization: 'Bearer your-token',
            'Content-Type': 'application/json',
          },
        }),
      );

      if (error || !response) {
        // console.error('Something went wrong: ' + error.message);
        return;
      }

      const currentScheduleResponse = CartDetailResponseSchema.parse(
        response.data,
      ).data;

      lastFetchedId = currentId;
      $userCart.currentCart = currentScheduleResponse.cart;
      console.log($userCart.currentCart);
    };

    fetchCurrentSchedule(currentId);
  });

  $effect(() => {
    const currentQuery = searchState.query;
    const timeout = setTimeout(() => {
      searchState.debounced = currentQuery;
    }, 250);
    return () => clearTimeout(timeout);
  });

  const PROGRAM_LABEL: Record<string, string> = {
    S: 'ทวิภาค',
    I: 'นานาชาติ',
    T: 'ตรีภาค',
  };
  const SEMESTER_LABEL: Record<string, string> = {
    FIRST: 'ภาคต้น',
    SECOND: 'ภาคปลาย',
    SUMMER: 'ภาคฤดูร้อน',
  };

  const programLabel = $derived.by(() => {
    const cart = $userCart.currentCart;
    if (!cart?.academicYear) return '';
    const program = PROGRAM_LABEL[cart.studyProgram] ?? cart.studyProgram;
    const semester = SEMESTER_LABEL[cart.semester] ?? cart.semester;
    return `${program} ${cart.academicYear} / ${semester}`;
  });

  const scheduleOptions = $derived(
    $userCart.cartList?.map((item) => ({ name: item.name, id: item.id })) ?? [],
  );

  function toggleTheme() {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark');
  }

  const { createCart } = useCartActions();
  let showCreateScheduleModal = $state(false);
</script>

<Modal
  exitOnEsc
  exitOnBackgroundClick
  centered
  dim
  bind:show={loginPopupState.show}
>
  <LoginPopup
    onCancel={() => (loginPopupState.show = false)}
    onLogin={handleGoogleLogin}
  />
</Modal>

<Toaster />

<div class="relative flex h-dvh flex-col overflow-hidden">
  <Navbar
    onLogin={handleGoogleLogin}
    onSignOut={handleGoogleLogout}
    isLoggedIn={Boolean($session.data)}
    onSearchEnter={(query) => {
      searchState.query = query;
      goto('/');
    }}
    name={$session.data?.user.name}
    imageUrl={$session.data?.user.image ?? 'https://...'}
    {scheduleOptions}
    {programLabel}
    bind:currentScheduleId={$userCart.currentCartId}
    onToggleTheme={toggleTheme}
    onAddSchedule={() => (showCreateScheduleModal = true)}
  />

  <Modal
    exitOnEsc
    exitOnBackgroundClick
    centered
    dim
    bind:show={showCreateScheduleModal}
  >
    <CreateTimetable
      onConfirm={(schedule: TimetableMetaData) => {
        createCart(
          schedule.name,
          schedule.isPublic,
          schedule.semesterType,
          schedule.semester,
          schedule.academicYear,
        );
        showCreateScheduleModal = false;
      }}
      onCancel={() => (showCreateScheduleModal = false)}
    />
  </Modal>

  {#if page.url.pathname === '/'}
    {@render children?.()}
  {:else}
    <div class="relative flex-1 overflow-auto">
      {@render children?.()}
    </div>
  {/if}
</div>
