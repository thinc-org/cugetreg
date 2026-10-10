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

export const ACTIVITY_DAY_OPTIONS: { value: Day; label: string }[] = [
	{ value: 'MO', label: 'วันจันทร์' },
	{ value: 'TU', label: 'วันอังคาร' },
	{ value: 'WE', label: 'วันพุธ' },
	{ value: 'TH', label: 'วันพฤหัสบดี' },
	{ value: 'FR', label: 'วันศุกร์' },
	{ value: 'SA', label: 'วันเสาร์' },
	{ value: 'SU', label: 'วันอาทิตย์' }
];

/** Returns an error message when the HH:MM range is invalid, otherwise null. */
export function validateActivityTime(periodStart: string, periodEnd: string): string | null {
	if (!periodStart || !periodEnd) return 'กรุณาระบุเวลาเริ่มและเวลาจบ';
	if (periodEnd <= periodStart) return 'เวลาจบต้องอยู่หลังเวลาเริ่ม';
	return null;
}

export { default as CreateActivity } from './create-activity.svelte';
