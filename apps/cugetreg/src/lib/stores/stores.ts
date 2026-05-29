import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

export function useContextStore<T>(contextKey: symbol) {
  const initStore = (initialData: T): Writable<T> => {
    const store = writable<T>(initialData);
    setContext(contextKey, store);
    return store;
  };

  const getStore = (): Writable<T> => {
    const store = getContext<Writable<T>>(contextKey);
    if (!store) {
      throw new Error(
        `Store context missing for key: ${contextKey.toString()}. Did you forget to call initStore?`,
      );
    }
    return store;
  };

  return { initStore, getStore };
}
