import { reviewStatusMessages } from '$lib/i18n';

import { tv } from 'tailwind-variants';
export { default as StatusChip } from './status-chip.svelte';

export const chipVariants = tv({
	base: 'inline-flex select-none items-center justify-between gap-1 rounded-full px-2 py-1 text-caption transition-colors border focus:outline-none focus:ring-2 focus:ring-offset-2'
});

export type Variant = 'APPROVED' | 'REJECTED' | 'PENDING';
export const styles: Record<Variant, string> = {
	APPROVED: 'border-on-success-container bg-success-container text-on-success-container',
	PENDING: 'border-on-warning-container bg-warning-container text-on-warning-container',
	REJECTED: 'border-on-error-container bg-error-container text-on-error-container'
};

/** @deprecated Thai-only labels; use `reviewStatusMessages` from `$lib/i18n` instead. */
export const text: Record<Variant, string> = reviewStatusMessages.th;
