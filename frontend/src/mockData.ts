import type { Course, ScheduleData, ScheduleList } from "./types.ts";
import type { ScheduleList, ScheduleListItem } from "./types.ts";

import type { ScheduleList, ScheduleListItem } from "./types"; 

// ---------------------------------------------------------
// INTERFACES
// จำลอง Type ของ Course ที่รวม CourseInfo และ Course เข้าด้วยกัน
// ---------------------------------------------------------

interface SectionClassMock {
    dayOfWeek: "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
    periodStart: string; // Ex. "13:00"
    periodEnd: string;   
    startTime: number;   // Helper สำหรับ Frontend (Ex. 13)
    duration: number;    // Helper สำหรับ Frontend
    building: string;
    room: string;
}

interface CourseMock {
    courseNo: string;       // แทน code
    abbrName: string;       // แทน name
    courseNameEn: string;   
    credit: number;
    genEdType: "NO" | "SC" | "SO" | "HU" | "IN";
    sections: Record<number, SectionClassMock[]>; 
    midtermStart?: Date | null;
    finalStart?: Date | null;
    
    // --- ข้อมูลใหม่ที่ขอเพิ่ม ---
    regis: number;       // จำนวนนิสิตที่ลงทะเบียนแล้ว (ใช้ map เป็น seat)
    max: number;         // จำนวนรับสูงสุด (ใช้ map เป็น maxseat)
    reviewCount: number; // จำนวนรีวิว
    rating: number;      // คะแนนเฉลี่ย (เต็ม 5)

    // Helper getters (optional types for backward compat)
    midterm?: { date: Date; duration: number }; 
    final?: { date: Date; duration: number };
}

// ---------------------------------------------------------
// RAW DATA (ข้อมูลดิบ ก่อน Export)
// ---------------------------------------------------------

const rawCourseComPres: CourseMock = {
    courseNo: "5501214",
    abbrName: "COMM PRES SKILL",
    courseNameEn: "COMMUNICATION PRESENTATION SKILL",
    credit: 3,
    genEdType: "NO",
    regis: 20,
    max: 25,
    reviewCount: 12,
    rating: 4.5,
    sections: {
        6: [{
            dayOfWeek: "MO",
            periodStart: "13:00",
            periodEnd: "16:00",
            startTime: 13,
            duration: 3,
            building: "ENG4",
            room: "M07/4"
        }],
        1: [{
            dayOfWeek: "WE",
            periodStart: "13:00",
            periodEnd: "16:00",
            startTime: 13,
            duration: 3,
            building: "ENG3",
            room: "319"
        }]
    },
    midterm: {
        date: new Date("2024-12-01T08:30:00"),
        duration: 3
    },
    final: {
        date: new Date("2024-12-02T08:30:00"),
        duration: 3
    }
}

const rawCourseAppDev: CourseMock = {
    courseNo: "2190512",
    abbrName: "APP DEV",
    courseNameEn: "APPLICATION DEVELOPMENT",
    credit: 3,
    genEdType: "NO",
    regis: 55,
    max: 55, // เต็มแล้ว
    reviewCount: 48,
    rating: 4.8,
    sections: {
        1: [{
            dayOfWeek: "TU",
            periodStart: "09:00",
            periodEnd: "12:00",
            startTime: 9,
            duration: 3,
            building: "ENG2",
            room: "210"
        }],
        2: [{
            dayOfWeek: "WE",
            periodStart: "09:00",
            periodEnd: "12:00",
            startTime: 9,
            duration: 3,
            building: "ENG2",
            room: "210"
        }]
    },
    midterm: {
        date: new Date("2024-12-03T08:30:00"),
        duration: 3
    },
    final: {
        date: new Date("2024-12-04T13:00:00"),
        duration: 3,
    }
}

const rawCourseEffectCareer: CourseMock = {
    courseNo: "0201171",
    abbrName: "EFFECT CAREER MGT",
    courseNameEn: "EFFECTIVE CAREER MANAGEMENT",
    credit: 3,
    genEdType: "SO",
    regis: 15,
    max: 30,
    reviewCount: 5,
    rating: 3.2,
    sections: {
        71: [{
            dayOfWeek: "TH",
            periodStart: "09:00",
            periodEnd: "12:00",
            startTime: 9,
            duration: 3,
            building: "AR",
            room: "AR"
        }],
        73: [{
            dayOfWeek: "TH",
            periodStart: "13:00",
            periodEnd: "16:00",
            startTime: 13,
            duration: 3,
            building: "ENG2",
            room: "210"
        }]
    },
    final: {
        date: new Date("2024-12-05T13:00:00"),
        duration: 3,
    }
}

const courseCalculusI: Course = {
    name: "CALCULUS I",
    code: "0201171",
    credit: 3,
    genEdType: "SC",
    regis: 120,
    max: 150,
    reviewCount: 230,
    rating: 2.5, // วิชาหิน
    sections: {
        1: [
            {
                day: "TU",
                startTime: 8,
                duration: 1,
                building: "ENG2",
                room: "210"
            },
            {
                day: "WE",
                startTime: 8,
                duration: 1,
                building: "ENG2",
                room: "210"
            },
            {
                day: "TH",
                startTime: 8,
                duration: 1,
                building: "ENG2",
                room: "210"
            },
        ],
        2: [
            {
                day: "TU",
                startTime: 9,
                duration: 1,
                building: "ENG2",
                room: "210"
            },
            {
                day: "WE",
                startTime: 9,
                duration: 1,
                building: "ENG2",
                room: "210"
            },
            {
                day: "TH",
                startTime: 9,
                duration: 1,
                building: "ENG2",
                room: "210"
            },
        ]
    },
    midterm: {
        date: new Date("2024-12-03T13:00:00"),
        duration: 3,
    },
    final: {
        date: new Date("2024-12-04T08:30:00"),
        duration: 3,
    }
}

const courseLongName: Course = {
    name: "PNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOSIS",
    code: "0201171",
    credit: 3,
    gened: [],
    seat: 15,
    maxseat: 30,
    sections: {
        1: [
            {
                day: "FR",
                startTime: 13.5,
                duration: 3,
                building: "ENG2",
                room: "210"
            },
        ],
    },
    midterm: {
        date: new Date("2024-12-03T16:00:00"),
        duration: 1,
    },
    final: {
        date: new Date("2024-12-04T12:00:00"),
        duration: 1,
    }
}

const courseAI: Course = {
    name: "AI",
    code: "2190513",
    credit: 3,
    gened: [],
    seat: 15,
    maxseat: 30,
    sections: {
        1: [
            {
                day: "WE",
                startTime: 13,
                duration: 3,
                building: "ENG2",
                room: "210"
            },
        ],
    },
    midterm: {
        date: new Date("2024-12-01T13:00:00"),
        duration: 3,
    },
    final: {
        date: new Date("2024-12-02T08:30:00"),
        duration: 3,
    }
}

const rawCourseAI: CourseMock = {
    courseNo: "2190513",
    abbrName: "AI",
    courseNameEn: "ARTIFICIAL INTELLIGENCE",
    credit: 3,
    genEdType: "NO",
    regis: 28,
    max: 30,
    reviewCount: 15,
    rating: 4.2,
    sections: {
        1: [
            { dayOfWeek: "WE", periodStart: "13:00", periodEnd: "16:00", startTime: 13, duration: 3, building: "ENG2", room: "210" },
        ],
    },
    midtermStart: new Date("2024-12-01T13:00:00"),
    finalStart: new Date("2024-12-02T08:30:00"),

    get midterm() { return this.midtermStart ? { date: this.midtermStart, duration: 3 } : undefined },
    get final() { return this.finalStart ? { date: this.finalStart, duration: 3 } : undefined }
}

// ---------------------------------------------------------
// RAW SCHEDULES
// ---------------------------------------------------------

const rawMockSchedule = [
    {
        id: "1",
        course: rawCourseComPres,
        selectedSection: 6,
        hidden: false,
        colorVariant: "pink",
    },
    {
        id: "2",
        course: rawCourseAppDev,
        selectedSection: 1,
        hidden: false,
        colorVariant: "tangerine",
    },
    {
        id: "3",
        course: rawCourseEffectCareer,
        selectedSection: 71,
        hidden: false,
        colorVariant: "green"
    },
    {
        id: "6",
        course: rawCourseAI,
        selectedSection: 1,
        hidden: false,
        colorVariant: "purple"
    },
    {
        id: 5,
        course: courseLongName,
        selectedSection: 1,
        hidden: false,
        colorVariant: "teal"
    },
    {
        id: 6,
        course: courseAI,
        selectedSection: 1,
        hidden: false,
        colorVariant: "teal"
    },

]

const mockSchedule1: ScheduleData = [
    {
        id: 1,
        course: courseComPres,
        selectedSection: 6,
        hidden: false,
        colorVariant: "pink",
    },
    {
        id: 2,
        course: courseAppDev,
        selectedSection: 1,
        hidden: false,
        colorVariant: "tangerine",
    },
]

const mockSchedule2: ScheduleData = [
    {
        id: 3,
        course: courseEffectCareer,
        selectedSection: 71,
        hidden: false,
        colorVariant: "green"
    },
    {
        id: 4,
        course: courseCalculusI,
        selectedSection: 1,
        hidden: false,
        colorVariant: "purple"
    },
]

const mockSchedule3: ScheduleData = [
    {
        id: 5,
        course: courseLongName,
        selectedSection: 1,
        hidden: false,
        colorVariant: "teal"
    },
    {
        id: 6,
        course: courseAI,
        selectedSection: 1,
        hidden: false,
        colorVariant: "teal"
    },
]

const mockScheduleItem1: ScheduleListItem = {
    name: "ปี 2 เทอม 1",
    scheduleId: "1",
    schedule: mockSchedule1,
    semesterType: "Semester",
    semester: "2566/1",
    isPublic: false
}

const mockScheduleItem2: ScheduleListItem = {
    name: "ปี 2 เทอม 2",
    scheduleId: "2",
    schedule: mockSchedule2,
    semesterType: "Semester",
    semester: "2566/2",
    isPublic: true
}

const mockScheduleItem3: ScheduleListItem = {
    name: "ปี 3 เทอม 1",
    scheduleId: "3",
    schedule: mockSchedule3,
    semesterType: "Semester",
    semester: "2567/1",
    isPublic: false
}

const mockScheduleList: ScheduleList = [
    mockScheduleItem1,
    mockScheduleItem2,
    mockScheduleItem3,
];

export {
    courseCalculusI,
    courseEffectCareer,
    courseAppDev,
    courseComPres,
    courseLongName,
    courseAI,
    mockSchedule,
    mockSchedule1,
    mockSchedule2,
    mockSchedule3,
    mockScheduleList
};

// Export ตัวแปรที่ผ่าน Adapter แล้ว
export const courseComPres = adaptCourse(rawCourseComPres);
export const courseAppDev = adaptCourse(rawCourseAppDev);
export const courseEffectCareer = adaptCourse(rawCourseEffectCareer);
export const courseCalculusI = adaptCourse(rawCourseCalculusI);
export const courseLongName = adaptCourse(rawCourseLongName);
export const courseAI = adaptCourse(rawCourseAI);

// Map ข้อมูลใน Schedule List ให้ใช้ Adapted Course
export const mockScheduleList = rawMockScheduleList.map(item => ({
    ...item,
    schedule: item.schedule.map(sch => ({
        ...sch,
        course: adaptCourse(sch.course as CourseMock)
    }))
}));

// Export mockSchedule แบบเดี่ยวๆ
export const mockSchedule = rawMockSchedule.map(sch => ({
    ...sch,
    course: adaptCourse(sch.course as CourseMock)
}));

export const mockSchedule1 = rawMockSchedule1.map(sch => ({
    ...sch,
    course: adaptCourse(sch.course as CourseMock)
}));

export const mockSchedule2 = rawMockSchedule2.map(sch => ({
    ...sch,
    course: adaptCourse(sch.course as CourseMock)
}));

export const mockSchedule3 = rawMockSchedule3.map(sch => ({
    ...sch,
    course: adaptCourse(sch.course as CourseMock)
}));