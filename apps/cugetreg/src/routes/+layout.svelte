<script lang="ts">
  import '$lib/styles/app.css';

  import { tryCatch } from '$lib/async-handler';
  import { initUserStore } from '$lib/stores/user';
  import { getUserCartStore, initUserCartStore } from '$lib/stores/user-cart';

  import axios from 'axios';
  import type { Snippet } from 'svelte';

  import { Navbar } from '@cugetreg/ui/organisms/navbar';
  import { CartDetailResponseSchema } from '@cugetreg/zod-schemas/cart-response';

  import type { LayoutData } from './$types';

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

<Navbar />

{@render children?.()}
