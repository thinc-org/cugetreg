import type { Handle, HandleFetch } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
  try {
    console.log('Cookie in handle:', event.request.headers.get('cookie'));
    const res = await event.fetch(`${PUBLIC_API_URL}/auth/get-session`, {
      headers: event.request.headers, // forwards the session cookie
    });

    const session = res.ok ? await res.json() : null;
    console.log(session);
    event.locals.user = session?.user ?? null;
    event.locals.session = session?.session ?? null;
  } catch {
    event.locals.user = null;
    event.locals.session = null;
  }

  return resolve(event);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  const cookie = event.request.headers.get('cookie');

  console.log('handleFetch URL:', request.url); // is this your backend?
  console.log('Forwarding cookie:', cookie); // is this populated?
  if (cookie) {
    request.headers.set('cookie', cookie);
  }

  return fetch(request);
};
