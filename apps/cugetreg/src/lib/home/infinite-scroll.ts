import type { Action } from 'svelte/action';

interface InfiniteScrollOptions {
  onIntersect: () => void;
  root?: Element | null;
  rootMargin?: string;
}

export const infiniteScroll: Action<HTMLElement, InfiniteScrollOptions> = (
  node,
  options,
) => {
  let observer: IntersectionObserver;

  const observe = (nextOptions: InfiniteScrollOptions) => {
    observer?.disconnect();
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) nextOptions.onIntersect();
      },
      {
        root: nextOptions.root ?? null,
        rootMargin: nextOptions.rootMargin ?? '400px',
      },
    );
    observer.observe(node);
  };

  observe(options);

  return {
    update: observe,
    destroy: () => observer.disconnect(),
  };
};
