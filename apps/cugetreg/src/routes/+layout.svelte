<script lang="ts">
  import {
    handleGoogleLogin,
    handleGoogleLogout,
    useSession,
  } from '$lib/auth-client'
  import '$lib/styles/app.css'
  import { page } from '$app/state'
  import { goto } from '$app/navigation'
  import { Navbar } from '@cugetreg/ui/organisms/navbar'
  import toast, { Toaster } from 'svelte-french-toast'
  import { tryCatch } from '$lib/async-handler';
  import { initUserStore } from '$lib/stores/user';
  import { getUserCartStore, initUserCartStore } from '$lib/stores/user-cart';
  import axios from 'axios';
  import type { Snippet } from 'svelte';
  import { CartDetailResponseSchema } from '@cugetreg/zod-schemas/cart-response';

  import type { LayoutData } from './$types';

  const session = useSession()

  $effect(() => {
    const errorMsg = page.url.searchParams.get('error')

    if (errorMsg) {
      let message = 'Something went wrong.'
      if (errorMsg === 'non_chula_email') {
        message = 'Please login with Chula email.'
      }

      toast.error(message, {
        position: 'bottom-right',
      })

      const cleanUrl = new URL(page.url)
      cleanUrl.searchParams.delete('error')

      goto(cleanUrl, { replaceState: true, keepFocus: true })
    }
  })

  let {
    data,
    children,
  }: {
    data: LayoutData;
    children?: Snippet;
  } = $props();

  initUserCartStore((() => data)());

  const userCart = getUserCartStore();

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

<!-- TODO: Other page already have navbar which need to be removed -->
{@render children?.()}
