import type { Day } from '../../atoms/day-chip';
import type { Type } from '../../atoms/gened-chip';
export { default as SelectedCourse } from './selected-course.svelte';

export type Course = {
    id: number;
    code: string;
    name: string;
    credit: number;
    gened: Type[];
    seat: number;
    maxseat: number;
    review: number;
    days: Day[];
    sections: number[];
    selectedSection: string;
    hidden: boolean;
}

//TODO: Unified all type
export interface SelectedCourseData {
    courses: Course[];
}
