import { browser } from '$app/environment';
import { afterNavigate, replaceState } from '$app/navigation';
import { resolve } from '$app/paths';
import { page } from '$app/state';
import { homeStore } from '$lib/homeStore.svelte';

import { buildHomeUrl, type HomeUrlState, parseHomeUrl } from './home-url';

interface HomeUrlSyncOptions {
  read: () => HomeUrlState;
  apply: (state: HomeUrlState) => void;
}

export function createHomeUrlSync({ read, apply }: HomeUrlSyncOptions) {
  let applyingUrl = false;

  const applyCurrentUrl = () => {
    applyingUrl = true;
    apply(parseHomeUrl(page.url));
    applyingUrl = false;
    if (browser) homeStore.currentUrl = page.url.toString();
  };

  applyCurrentUrl();
  afterNavigate(applyCurrentUrl);

  $effect(() => {
    const state = read();
    const currentUrl = page.url;
    if (applyingUrl) return;

    const nextUrl = buildHomeUrl(currentUrl, state);
    const pathname = resolve('/[program]/courses', {
      program: state.currentProgram,
    });
    nextUrl.pathname = pathname;
    const targetUrl = `${pathname}${nextUrl.search}`;
    if (`${currentUrl.pathname}${currentUrl.search}` !== targetUrl) {
      // targetUrl already contains the base-aware pathname returned by resolve.
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      replaceState(targetUrl, page.state);
    }
    homeStore.currentUrl = targetUrl;
  });
}
