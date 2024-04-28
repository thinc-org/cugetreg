import { browser } from '$app/environment'
import { QueryClient } from '@tanstack/svelte-query'

export function load(payload) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  })

  return {
    queryClient,
    darkMode: payload.data.darkMode,
  }
}
