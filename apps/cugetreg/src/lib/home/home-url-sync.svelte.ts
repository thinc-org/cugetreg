import { browser } from '$app/environment';
import { afterNavigate, goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { page } from '$app/state';
import { homeStore } from '$lib/homeStore.svelte';

import { untrack } from 'svelte';

import { buildHomeUrl, type HomeUrlState, parseHomeUrl } from './home-url';

interface HomeUrlSyncOptions {
  read: () => HomeUrlState;
  apply: (state: HomeUrlState) => void;
}

export function createHomeUrlSync({ read, apply }: HomeUrlSyncOptions) {
  let syncedUrl: string | undefined;

  const applyCurrentUrl = () => {
    const currentUrl = `${page.url.pathname}${page.url.search}`;
    if (currentUrl !== syncedUrl) {
      syncedUrl = currentUrl;
      apply(parseHomeUrl(page.url));
    }
    if (browser) homeStore.currentUrl = page.url.toString();
  };

  applyCurrentUrl();
  afterNavigate(applyCurrentUrl);

  $effect(() => {
    const state = read();
    const currentUrl = page.url;
    if (`${currentUrl.pathname}${currentUrl.search}` !== syncedUrl) return;

    const nextUrl = buildHomeUrl(currentUrl, state);
    const pathname = resolve('/[program]/courses', {
      program: state.currentProgram,
    });
    nextUrl.pathname = pathname;
    const targetUrl = `${pathname}${nextUrl.search}`;
    if (`${currentUrl.pathname}${currentUrl.search}` !== targetUrl) {
      syncedUrl = targetUrl;
      untrack(() => {
        goto(targetUrl, {
          replaceState: true,
          keepFocus: true,
          noScroll: true,
        });
      });
    }
    homeStore.currentUrl = targetUrl;
  });
}
