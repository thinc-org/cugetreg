<script lang="ts">
  import '$lib/styles/app.css';

  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { tryCatch } from '$lib/async-handler';
  import {
    handleGoogleLogin,
    handleGoogleLogout,
    useSession,
  } from '$lib/auth-client';
  import {
    CART_PROMISE_KEY,
    initUserCartStore,
    type UserCartInterface,
  } from '$lib/stores/user-cart';

  import axios from 'axios';
  import { setContext, type Snippet } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast';

  import { Navbar } from '@cugetreg/ui/organisms/navbar';
  import { CartDetailResponseSchema } from '@cugetreg/zod-schemas/cart-response';

  import type { LayoutData } from './$types';

  const session = useSession();

  $effect(() => {
    const errorMsg = page.url.searchParams.get('error');

    if (errorMsg) {
      let message = 'Something went wrong.';
      if (errorMsg === 'non_chula_email') {
        message = 'Please login with Chula email.';
      }

      toast.error(message, {
        position: 'bottom-right',
      });

      const cleanUrl = new URL(page.url);
      cleanUrl.searchParams.delete('error');

      goto(cleanUrl, { replaceState: true, keepFocus: true });
    }
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
    (cart) => userCart.set(cart),
    (err) => console.error('[layout] failed to load cart:', err),
  );

  setContext(CART_PROMISE_KEY, cartPromise);

  let lastFetchedId = '';

  $effect(() => {
    const currentId = $userCart.currentCartId;

    if (!currentId || currentId === lastFetchedId) return;

    const fetchCurrentSchedule = async (id: string) => {
      // TODO: Move this
      const API_URL = 'http://localhost:3000/api/v1/carts/';

      const [response, error] = await tryCatch(
        axios.get(API_URL + id, {
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
</script>

<Toaster />
<Navbar
  onLogin={handleGoogleLogin}
  onSignOut={handleGoogleLogout}
  isLoggedIn={Boolean($session.data)}
  name={$session.data?.user.name}
  imageUrl={$session.data?.user.image ??
    'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'}
/>

<div class="relative flex h-dvh flex-col overflow-hidden">
  {#if page.url.pathname === '/'}
    {@render children?.()}
  {:else}
    <div class="h-16 shrink-0 md:h-20"></div>
    <div class="relative flex-1 overflow-auto">
      {@render children?.()}
    </div>
  {/if}
</div>
