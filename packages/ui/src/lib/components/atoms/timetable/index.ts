import { tv, type VariantProps } from 'tailwind-variants';

import { courseColorVariants } from '@cugetreg/utils/constants';

export const timeTableCourseCardVariant = tv({
	base: [
		'absolute overflow-hidden @container-[size]',
		'w-[calc(100%/var(--cols)*var(--len))]',
		'h-[calc(100%/var(--rows))]',
		'top-[calc(100%/var(--rows)*var(--x))]',
		'left-[calc(100%/var(--cols)*var(--y))]',
		'flex flex-col justify-center items-center',
		'border-1 rounded-lg',
		'hover:cursor-pointer hover:z-40 select-none'
	],
	variants: {
		color: {
			conflict: 'bg-red-300 border-red-800 text-red-800',
			...courseColorVariants

			// neutral: 'bg-neutral-300 border-neutral-500 text-neutral-700',
			// pink: 'bg-pink-300 border-pink-500 text-pink-700',
			// tangerine: 'bg-tangerine-300 border-tangerine-500 text-tangerine-700',
			// orange: 'bg-orange-300 border-orange-500 text-orange-700',
			// yellow: 'bg-yellow-300 border-yellow-500 text-yellow-700',
			// green: 'bg-green-300 border-green-500 text-green-700',
			// teal: 'bg-teal-300 border-teal-500 text-teal-700',
			// sky: 'bg-sky-300 border-sky-500 text-sky-700',
			// indigo: 'bg-indigo-300 border-indigo-500 text-indigo-700',
			// purple: 'bg-purple-300 border-purple-500 text-purple-700',
		}
	},
	defaultVariants: {
		length: 3,
		color: 'neutral'
	}
});

export type TimeTableCourse = {
	name: string;
	code: string;
	bldg: string;
	room: string;
	section: number;
};

export type TimeTableCardColor = VariantProps<typeof timeTableCourseCardVariant>['color'];

export interface TimeTableContext {
	periodPerDay: number;
	amountOfDays: number;
}

export { default as TimeTable } from './timetable.svelte';
export { default as TimetableCourseCard } from './timetable-course-card.svelte';
