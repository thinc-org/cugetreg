import { writable } from 'svelte/store';

export const searchQuery = writable<string>('');
export const debouncedSearchQuery = writable<string>('');
