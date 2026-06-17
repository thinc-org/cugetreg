import { invalidateAll } from '$app/navigation';
import { env } from '$env/dynamic/public';

const PUBLIC_API_URL = env.PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

import { createAuthClient } from 'better-auth/svelte';

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: `${PUBLIC_API_URL}/auth`,
});

export const handleGoogleLogin = async () => {
  const appURL =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:5173';
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
