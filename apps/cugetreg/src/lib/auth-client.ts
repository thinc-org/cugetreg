import { createAuthClient } from 'better-auth/svelte';
import { PUBLIC_API_URL } from '$env/static/public';

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: `${PUBLIC_API_URL}/auth`,
});

export const handleGoogleLogin = async () => {
  console.log('Logging in...');
  await signIn.social({
    provider: 'google',
    callbackURL: 'http://localhost:5173',
    errorCallbackURL: 'http://localhost:5173',
    fetchOptions: {
      onError: (context) => {
        console.error(context.error.message);
      },
    },
  });
};

export const handleGoogleLogout = async () => {
  await signOut();
  window.location.reload();
};
