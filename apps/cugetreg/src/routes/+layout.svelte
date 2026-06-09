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
  import { searchState } from '$lib/stores/search.svelte';
  import { getUserCartStore, initUserCartStore } from '$lib/stores/user-cart';

  import type { Snippet } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast';

  import { Navbar } from '@cugetreg/ui/organisms/navbar';
  import { CartDetailResponseSchema } from '@cugetreg/zod-schemas/carts-response';

  import type { LayoutData } from './$types';

  const session = useSession();

  $effect(() => {
    const errorMsg = page.url.searchParams.get('error');

    if (errorMsg) {
      let message = 'Something went wrong.';
      if (errorMsg === 'non_chula_email') {
        message = 'Please login with Chula email.';
      }

      if (errorMsg === 'no_session') {
        message = 'Please login before viewing this page.';
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

  initUserCartStore((() => data.data)());

  const userCart = getUserCartStore();

  let lastFetchedId = '';

  $effect(() => {
    const currentId = $userCart.currentCartId;

    if (!currentId || currentId === lastFetchedId) return;

    const fetchCurrentSchedule = async (id: string) => {
      // TODO: Move this
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
</script>

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
  />

  {#if page.url.pathname === '/'}
    {@render children?.()}
  {:else}
    <div class="relative flex-1 overflow-auto">
      {@render children?.()}
    </div>
  {/if}
</div>
