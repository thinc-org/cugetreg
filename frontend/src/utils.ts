import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { defaultConfig } from 'tailwind-variants'
import type { CourseSchedule } from './types'

defaultConfig.twMerge = false

const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'font-size': [
                {
                    text: [
                        'table-header',
                        'subtitle',
                        'body1',
                        'body2',
                        'button1',
                        'button2',
                        'caption',
                    ],
                },
            ],
        },
    },
})

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// TDD By ChatGPT
export function getShortenName(fullName: string): string {
    // Remove text inside square brackets (including brackets themselves)
    const sanitized = fullName.replace(/\[.*?\]/g, '').trim()

    // Split the sanitized name into parts
    const parts = sanitized.split(/\s+/)

    if (parts.length < 2) {
        // If there's only one part, return it as is (optional, depending on requirements)
        return parts[0] || ''
    }

    // Extract first name and last name (or last relevant part)
    const firstName = parts[0]
    const lastName = parts[parts.length - 1]

    if (firstName === lastName) {
        // If first name is the same as last name, return first name only
        return firstName
    }

    // Return first name and abbreviated last name
    return `${firstName} ${lastName.charAt(0)}.`
}

export function formatScheduleTime(time: number): string {
    const hour = Math.floor(time);
    const minute = Math.floor(60 * (time - hour));

    const hourStr = String(hour).padStart(2, '0');
    const minuteStr = String(minute).padStart(2, '0');

    return `${hourStr}:${minuteStr}`;
}

export function formatTimePeriod(startTime?: number, duration?: number): string {
    if (!startTime || !duration) return "";

    return `${formatScheduleTime(startTime)} - ${formatScheduleTime(startTime + duration)}`;
}


export function isMidtermConflict(course: CourseSchedule, otherCourses: CourseSchedule[]) {
    const { midterm } = course.course;

    if (!midterm) return false;

    const midtermStart = midterm.startTime;
    const midtermEnd = midterm.startTime + midterm.duration;

    for (const other of otherCourses) {
        if (other === course || other.hidden) continue;

        const { midterm: otherMidterm } = other.course;
        if (!otherMidterm) continue;

        const otherStart = otherMidterm.startTime;
        const otherEnd = otherStart + otherMidterm.duration;

        if (
            midtermStart < otherEnd &&
            otherStart < midtermEnd
        ) {
            return true;
        }

    }

    return false;
}

export function isFinalsConflict(course: CourseSchedule, otherCourses: CourseSchedule[]) {
    const { final } = course.course;

    if (!final) return false;

    const finalStart = final.startTime;
    const finalEnd = final.startTime + final.duration;

    for (const other of otherCourses) {
        if (other === course || other.hidden) continue;

        const { final: otherfinal } = other.course;
        if (!otherfinal) continue;

        const otherStart = otherfinal.startTime;
        const otherEnd = otherStart + otherfinal.duration;

        if (
            finalStart < otherEnd &&
            otherStart < finalEnd
        ) {
            return true;
        }

    }

    return false;
}
