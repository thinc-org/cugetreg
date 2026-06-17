import { invalidateAll } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';

import { createAuthClient } from 'better-auth/svelte';

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: `${PUBLIC_API_URL}/auth`,
});

export const handleGoogleLogin = async () => {
  const appURL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  await signIn.social({
    provider: 'google',
    callbackURL: appURL,
    errorCallbackURL: appURL,
    fetchOptions: {
      onError: (context) => {
        console.error(context.error.message);
      },
    },
  });
};

export const handleGoogleLogout = async () => {
  await signOut();
  await invalidateAll();
  window.location.reload();
};
