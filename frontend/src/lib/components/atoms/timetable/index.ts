import { tv, type VariantProps } from 'tailwind-variants';
import type { Course } from '../../molecules/course-card';
import type { Day } from '../day-chip';

const timeCourseCardVariant = tv({
    base: ["absolute z-10 h-[calc(100%-1px)] rounded-lg left-0 top-0",
        "bg-indigo-400 border border-indigo-600 text-[1cqw] font-normal",
        ""
    ],
    variants: {
        length: {
            1: "w-[calc(100%-1px)]",
            2: "w-[calc(200%-1px)]",
            3: "w-[calc(300%-1px)]",
            4: "w-[calc(400%-1px)]"
        }
    }
});

export function hasConflict(slots: Slot[], time: number): boolean {
    const targetSlot = slots[time];

    if (Array.isArray(targetSlot))
        return true;

    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];

        if (!slot || i === time)
            continue;

        const periods = Array.isArray(slot) ? slot : [slot];
        const end = time + (targetSlot.length ?? 1) - 1;

        for (const period of periods) {
            const startTime = i;
            const endTime = i + (period.length ?? 1) - 1;

            if (time >= startTime && time <= endTime) {
                return true;
            }

            if (end >= startTime && end <= endTime) {
                return true;
            }
        }
    }

    return false;
}

export interface Period {
    course: Course;
    length: Length;
}

export type Slot = Period | Period[];
export type Schedule = Record<NonNullable<Day>, Slot[]>

type Length = VariantProps<typeof timeCourseCardVariant>['length'];

export { default as CourseTimeSlot } from './timetable-course-card.svelte';
export { default as TimeTable } from './timetable.svelte';
export { timeCourseCardVariant, type Length };
