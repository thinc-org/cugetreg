import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

import { type Handle, type HandleFetch, redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const API_BASE = privateEnv.API_URL
    ? `${privateEnv.API_URL}/api/v1`
    : publicEnv.PUBLIC_API_URL;
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

  // Allow unauthenticated access to public schedule views (schedule/[slug])
  const isPublicScheduleView = /^\/schedule\/[^/]+$/.test(event.url.pathname);

  if (
    !event.locals.user &&
    !isPublicScheduleView &&
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
