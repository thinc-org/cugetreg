import { type Locale, useLocale } from './locale.svelte';

export type Params = Record<string, string | number>;

export type Messages<K extends string = string> = {
	th: Record<K, string>;
	en: Record<K, string>;
};

/** Replaces `{name}` placeholders with values from `params`. */
export function interpolate(message: string, params?: Params): string {
	if (!params) return message;
	return message.replace(/\{(\w+)\}/g, (match, name: string) =>
		name in params ? String(params[name]) : match
	);
}

/**
 * Declares a TH/EN dictionary. The `en` side must contain exactly the keys of `th`.
 *
 * @example
 * const messages = defineMessages({
 * 	th: { search: 'ค้นหาวิชา' },
 * 	en: { search: 'Search courses' }
 * });
 */
export function defineMessages<const T extends Record<string, string>>(messages: {
	th: T;
	en: Record<keyof T, string>;
}): Messages<Extract<keyof T, string>> {
	return messages;
}

/** Looks up a message for an explicit locale. Use outside components, e.g. in mappers. */
export function translate<K extends string>(
	messages: Messages<K>,
	locale: Locale,
	key: K,
	params?: Params
): string {
	return interpolate(messages[locale][key], params);
}

/**
 * Returns a reactive `t(key, params?)` bound to the current locale.
 * Must be called during component initialisation.
 */
export function useTranslations<K extends string>(messages: Messages<K>) {
	const locale = useLocale();
	return (key: K, params?: Params) => translate(messages, locale.current, key, params);
}
