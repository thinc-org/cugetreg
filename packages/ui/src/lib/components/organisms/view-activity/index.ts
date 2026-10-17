import type { ColorVariant, Day } from '@cugetreg/utils/types';

export type ViewActivityData = {
	id: string;
	title: string;
	description: string;
	dayOfWeek: Day;
	periodStart: string;
	periodEnd: string;
	color: ColorVariant;
	hidden: boolean;
};

export type ViewActivityUpdate = Partial<
	Pick<ViewActivityData, 'dayOfWeek' | 'periodStart' | 'periodEnd' | 'color' | 'hidden'>
>;

export { default as ViewActivity } from './view-activity.svelte';
