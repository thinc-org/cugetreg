import { env as publicEnv } from '$env/dynamic/public';

import { type Handle, type HandleFetch, redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const API_BASE = publicEnv.PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
  try {
    const res = await event.fetch(`${API_BASE}/auth/get-session`, {
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

  const protectedRoutes = ['/schedule', '/profile'];

  if (
    !event.locals.user &&
    protectedRoutes.find((route) => event.url.pathname.startsWith(route))
  ) {
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
