import { createAuthClient } from 'better-auth/svelte';

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: 'http://localhost:3000/api/v1/auth',
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
};
