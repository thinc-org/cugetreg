import { tv, type VariantProps } from 'tailwind-variants';
import { courseColorVariants } from '../../../../constants';

export const timeTableCourseCardVariant = tv({
    base: [
        "absolute overflow-hidden @container-[size]",
        "w-[calc(100%/var(--cols)*var(--len))]",
        "h-[calc(100%/var(--rows))]",
        "top-[calc(100%/var(--rows)*var(--x))]",
        "left-[calc(100%/var(--cols)*var(--y))]",
        "flex flex-col justify-center items-center",
        "border-1 rounded-lg",
        "hover:cursor-pointer hover:z-100 select-none"
    ],
    variants: {
        color: courseColorVariants
    },
    defaultVariants: {
        length: 3,
        color: 'neutral'
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
