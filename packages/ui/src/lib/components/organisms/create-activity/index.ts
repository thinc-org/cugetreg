import { defineMessages, type Locale, translate } from '$lib/i18n';

import type { ColorVariant, Day } from '@cugetreg/utils/types';

export type ActivityFormData = {
	title: string;
	description: string;
	/** One activity is created per selected day. */
	daysOfWeek: Day[];
	periodStart: string;
	periodEnd: string;
	color: ColorVariant;
};

export const ACTIVITY_TITLE_MAX_LENGTH = 30;

/** The 10 colors offered for activities in the design (no dark variants). */
export const ACTIVITY_COLOR_OPTIONS: ColorVariant[] = [
	'primary',
	'pink',
	'tangerine',
	'orange',
	'yellow',
	'green',
	'teal',
	'sky',
	'indigo',
	'purple'
];

/** Full day names used by the activity forms. */
export const activityDayMessages = defineMessages({
	th: {
		MO: 'วันจันทร์',
		TU: 'วันอังคาร',
		WE: 'วันพุธ',
		TH: 'วันพฤหัสบดี',
		FR: 'วันศุกร์',
		SA: 'วันเสาร์',
		SU: 'วันอาทิตย์'
	},
	en: {
		MO: 'Monday',
		TU: 'Tuesday',
		WE: 'Wednesday',
		TH: 'Thursday',
		FR: 'Friday',
		SA: 'Saturday',
		SU: 'Sunday'
	}
});

const ACTIVITY_DAYS: Day[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

/** Day options (Monday→Sunday) labelled in the given locale. */
export function getActivityDayOptions(locale: Locale = 'th'): { value: Day; label: string }[] {
	return ACTIVITY_DAYS.map((value) => ({
		value,
		label: translate(activityDayMessages, locale, value)
	}));
}

/** @deprecated Thai-only labels; use `getActivityDayOptions(locale)`. */
export const ACTIVITY_DAY_OPTIONS: { value: Day; label: string }[] = getActivityDayOptions('th');

const activityTimeMessages = defineMessages({
	th: {
		missing: 'กรุณาระบุเวลาเริ่มและเวลาจบ',
		order: 'เวลาจบต้องอยู่หลังเวลาเริ่ม'
	},
	en: {
		missing: 'Please enter a start and end time',
		order: 'End time must be after start time'
	}
});

/** Returns an error message when the HH:MM range is invalid, otherwise null. */
export function validateActivityTime(
	periodStart: string,
	periodEnd: string,
	locale: Locale = 'th'
): string | null {
	if (!periodStart || !periodEnd) return translate(activityTimeMessages, locale, 'missing');
	if (periodEnd <= periodStart) return translate(activityTimeMessages, locale, 'order');
	return null;
}

export { default as CreateActivity } from './create-activity.svelte';
