import { courseColorVariants } from "./constants";

export type ColorVariant = keyof typeof courseColorVariants;
export type Day = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
export type GenEdType = "SC" | "SO" | "HU" | "IN";

export type Period = {
    day: Day;
    startTime: number;
    duration: number;
    building: string;
    room: string;
}

export type Course = {
    name: string;
    code: string;
    credit: number;
    gened: GenEdType[];
    seat: number;
    maxseat: number;
    // review: number;
    sections: { [key: number]: Period[] };
}

export type CourseSchedule = {
    id: number;
    course: Course;
    selectedSection: number;
    hidden: boolean;
    conflicted?: boolean;
    colorVariant?: ColorVariant;
}

export type ScheduleData = CourseSchedule[];
