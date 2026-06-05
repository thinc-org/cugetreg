import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
  try {
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

  if (!event.locals.user && event.url.pathname.startsWith('/schedule')) {
    throw redirect(302, '/?error=no_session');
  }

  return resolve(event);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
  const cookie = event.request.headers.get('cookie');

  if (cookie) {
    request.headers.set('cookie', cookie);
  }

  return fetch(request);
};
