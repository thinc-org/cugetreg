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

export function isMidtermConflict(course: CourseSchedule, otherCourses: CourseSchedule[]) {
    const { midterm } = course.course;

    if (!midterm) return false;

    const midtermStart = midterm.date.getHours();
    const midtermEnd = midterm.date.getHours() + midterm.duration;

    for (const other of otherCourses) {
        if (other === course || other.hidden) continue;

        const { midterm: otherMidterm } = other.course;
        if (!otherMidterm) continue;

        const otherStart = otherMidterm.date.getHours();
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

    const finalStart = final.date.getHours();
    const finalEnd = final.date.getHours() + final.duration;

    for (const other of otherCourses) {
        if (other === course || other.hidden) continue;

        const { final: otherfinal } = other.course;
        if (!otherfinal) continue;

        const otherStart = otherfinal.date.getHours();
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

const USE_CHRISTIAN_YEAR = false;

export function formatDate(date: Date): string {
    if (!date || date.getTime() === 0) return "TBA";

    const DAYS_TH = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
    const MONTH_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    const day = date.getDay();
    const cdate = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const offset = USE_CHRISTIAN_YEAR ? 0 : 543;

    return `${DAYS_TH[day]} ${cdate} ${MONTH_TH[month]} ${year + offset}`;
}

export function formatExamTime(date?: Date, duration?: number): string {
    if (!date || !duration) return "TBA";

    const end = new Date(date.getTime() + duration * 60 * 60 * 1000);

    const startH = String(date.getHours()).padStart(2, '0');
    const startM = String(date.getMinutes()).padStart(2, '0');
    const endH = String(end.getHours()).padStart(2, '0');
    const endM = String(end.getMinutes()).padStart(2, '0');

    return `${startH}:${startM} - ${endH}:${endM} น.`;
}

export function formatExamColumn(date?: Date): number {
    if (!date) return 0;

    const h = date.getHours();
    const m = date.getMinutes();

    return h + (m / 60);
}

export function discardTime(time: number): number {
    const mod = time % (1000 * 60 * 60 * 24);
    return time - mod;
}
