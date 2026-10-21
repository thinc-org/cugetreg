import { getContext, hasContext, setContext } from 'svelte';

export const LOCALES = ['th', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'th';
export const LOCALE_COOKIE = 'locale';

export function isLocale(value: unknown): value is Locale {
	return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export class LocaleState {
	current = $state<Locale>(DEFAULT_LOCALE);

	constructor(initial: Locale = DEFAULT_LOCALE) {
		this.current = initial;
	}

	set(locale: Locale) {
		this.current = locale;
		if (typeof document === 'undefined') return;
		document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
		document.documentElement.lang = locale;
	}

	toggle() {
		this.set(this.current === 'th' ? 'en' : 'th');
	}
}

const LOCALE_KEY = Symbol('locale');

// Used when a component renders outside the app's root layout (e.g. Storybook).
const fallbackLocale = new LocaleState();

/** Call once in the root layout, with the locale resolved on the server. */
export function initLocale(initial: Locale): LocaleState {
	return setContext(LOCALE_KEY, new LocaleState(initial));
}

/** Must be called during component initialisation. */
export function useLocale(): LocaleState {
	return hasContext(LOCALE_KEY) ? getContext<LocaleState>(LOCALE_KEY) : fallbackLocale;
}
