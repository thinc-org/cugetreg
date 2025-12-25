import { tv, type VariantProps } from 'tailwind-variants';

export const timeTableCourseCardVariant = tv({
    base: [
        "absolute @container overflow-hidden",
        "w-[calc(100%/var(--cols)*var(--len))]",
        "h-[calc(100%/var(--rows))]",
        "top-[calc(100%/var(--rows)*var(--x))]",
        "left-[calc(100%/var(--cols)*var(--y))]",
        "flex flex-col justify-center items-center",
        "border-2 border-amber-400 rounded-lg",
        "hover:cursor-pointer select-none"
    ],
    variants: {
        color: {
            //TODO: Add more colors
            amber: 'bg-amber-200 border-amber-800 text-amber-800',
            tangerine: 'bg-tangerine-300 border-tangerine-700 text-tangerine-700',
            purple: 'bg-purple-300 border-purple-700 text-purple-700',
            blue: 'bg-blue-300 border-blue-700 text-blue-700',
            conflict: 'bg-red-300/50 border-red-800 text-red-800'
        }
    },
    defaultVariants: {
        length: 3,
        color: 'amber'
    }
});

export type TimeTableCourse = {
    name: string,
    code: string,
    bldg: string,
    room: string,
    section: number
}

export type TimeTableCardColor = VariantProps<typeof timeTableCourseCardVariant>['color'];

export interface TimeTableContext {
    periodPerDay: number;
    amountOfDays: number;
}

export { default as CourseTimeSlot } from './timetable-course-card.svelte';
export { default as TimeTable } from './timetable.svelte';
