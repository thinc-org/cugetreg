<script lang="ts">
  import '$lib/styles/app.css';

  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import {
    handleGoogleLogin,
    handleGoogleLogout,
    useSession,
  } from '$lib/auth-client';
  import LoadingScreen from '$lib/components/loading-screen.svelte';
  import { semesterToThaiMapper, studyProgramMapper } from '$lib/mapper';
  import { initCartSelectionController } from '$lib/stores/cart-selection.svelte';
  import { loginPopupState } from '$lib/stores/login-popup.svelte';
  import { searchState } from '$lib/stores/search.svelte';
  import {
    CART_PROMISE_KEY,
    initUserCartStore,
    useCartActions,
    type UserCartInterface,
  } from '$lib/stores/user-cart';

  import { onDestroy, setContext, type Snippet } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast';

  import { Modal } from '@cugetreg/ui/atoms/modal';
  import {
    CreateTimetable,
    type TimetableMetaData,
  } from '@cugetreg/ui/organisms/create-timetable';
  import { LoginPopup } from '@cugetreg/ui/organisms/login-popup';
  import { Navbar } from '@cugetreg/ui/organisms/navbar';

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
      studyProgram: 'S',
      academicYear: 0,
      semester: 'FIRST',
      visible: '',
      isDefault: false,
      cartOrder: '',
      items: [],
      activityItems: [],
    },
    currentCartId: '',
    cartList: [],
    exams: [],
  };

  const userCart = initUserCartStore(EMPTY_CART);
  const cartSelection = initCartSelectionController(userCart);
  onDestroy(() => cartSelection.destroy());

  const cartPromise = (() => data.cart)();

  // Full-screen loading shown on initial app load until the cart settles.
  let appLoading = $state(true);

  cartPromise
    .then(
      (cart) => {
        if (cart) userCart.set(cart);
        return cart;
      },
      (err) => console.error('[layout] failed to load cart:', err),
    )
    .finally(() => (appLoading = false));

  setContext(CART_PROMISE_KEY, cartPromise);

  $effect(() => {
    const currentQuery = searchState.query;
    const timeout = setTimeout(() => {
      searchState.debounced = currentQuery;
    }, 250);
    return () => clearTimeout(timeout);
  });

  const programLabel = $derived.by(() => {
    const cart = $userCart.currentCart;
    if (!cart?.academicYear) return '';
    const program = studyProgramMapper(cart.studyProgram);
    const semester = semesterToThaiMapper(cart.semester);
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

{#if appLoading}
  <LoadingScreen />
{/if}

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
    bind:currentScheduleId={
      () => cartSelection.selectedId, (id) => void cartSelection.select(id)
    }
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
