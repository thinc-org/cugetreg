// src/mockData.ts

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
    midtermStart: new Date("2024-12-01T08:30:00"),
    finalStart: new Date("2024-12-02T08:30:00"),
    
    get midterm() { return this.midtermStart ? { date: this.midtermStart, duration: 3 } : undefined },
    get final() { return this.finalStart ? { date: this.finalStart, duration: 3 } : undefined }
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
    midtermStart: new Date("2024-12-03T08:30:00"),
    finalStart: new Date("2024-12-04T13:00:00"),
    
    get midterm() { return this.midtermStart ? { date: this.midtermStart, duration: 3 } : undefined },
    get final() { return this.finalStart ? { date: this.finalStart, duration: 3 } : undefined }
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
    midtermStart: null,
    finalStart: new Date("2024-12-05T13:00:00"),
    
    get final() { return this.finalStart ? { date: this.finalStart, duration: 3 } : undefined }
}

const rawCourseCalculusI: CourseMock = {
    courseNo: "2301107",
    abbrName: "CALCULUS I",
    courseNameEn: "CALCULUS I",
    credit: 3,
    genEdType: "SC",
    regis: 120,
    max: 150,
    reviewCount: 230,
    rating: 2.5, // วิชาหิน
    sections: {
        1: [
            { dayOfWeek: "TU", periodStart: "08:00", periodEnd: "09:00", startTime: 8, duration: 1, building: "ENG2", room: "210" },
            { dayOfWeek: "WE", periodStart: "08:00", periodEnd: "09:00", startTime: 8, duration: 1, building: "ENG2", room: "210" },
            { dayOfWeek: "TH", periodStart: "08:00", periodEnd: "09:00", startTime: 8, duration: 1, building: "ENG2", room: "210" },
        ],
        2: [
            { dayOfWeek: "TU", periodStart: "09:00", periodEnd: "10:00", startTime: 9, duration: 1, building: "ENG2", room: "210" },
            { dayOfWeek: "WE", periodStart: "09:00", periodEnd: "10:00", startTime: 9, duration: 1, building: "ENG2", room: "210" },
            { dayOfWeek: "TH", periodStart: "09:00", periodEnd: "10:00", startTime: 9, duration: 1, building: "ENG2", room: "210" },
        ]
    },
    midtermStart: new Date("2024-12-03T13:00:00"),
    finalStart: new Date("2024-12-04T08:30:00"),
    
    get midterm() { return this.midtermStart ? { date: this.midtermStart, duration: 3 } : undefined },
    get final() { return this.finalStart ? { date: this.finalStart, duration: 3 } : undefined }
}

const rawCourseLongName: CourseMock = {
    courseNo: "9999999",
    abbrName: "PNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOSIS",
    courseNameEn: "PNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOSIS",
    credit: 3,
    genEdType: "NO",
    regis: 1,
    max: 30,
    reviewCount: 0,
    rating: 0,
    sections: {
        1: [
            { dayOfWeek: "FR", periodStart: "13:30", periodEnd: "16:30", startTime: 13.5, duration: 3, building: "ENG2", room: "210" },
        ],
    },
    midtermStart: new Date("2024-12-03T16:00:00"),
    finalStart: new Date("2024-12-04T12:00:00"),

    get midterm() { return this.midtermStart ? { date: this.midtermStart, duration: 1 } : undefined },
    get final() { return this.finalStart ? { date: this.finalStart, duration: 1 } : undefined }
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
        id: "4",
        course: rawCourseCalculusI,
        selectedSection: 1,
        hidden: false,
        colorVariant: "purple"
    },
    {
        id: "5",
        course: rawCourseLongName,
        selectedSection: 1,
        hidden: false,
        colorVariant: "teal"
    },
    {
        id: "6",
        course: rawCourseAI,
        selectedSection: 1,
        hidden: false,
        colorVariant: "teal"
    },
];

const rawMockSchedule1 = [
    rawMockSchedule[0],
    rawMockSchedule[1],
];

const rawMockSchedule2 = [
    rawMockSchedule[2],
    rawMockSchedule[3],
];

const rawMockSchedule3 = [
    rawMockSchedule[4],
    rawMockSchedule[5],
];

const rawMockScheduleList: ScheduleList = [
    {
        name: "ปี 2 เทอม 1",
        scheduleId: "1",
        schedule: rawMockSchedule1,
        semesterType: "Semester",
        semester: "2566/1",
        isPublic: false
    },
    {
        name: "ปี 2 เทอม 2",
        scheduleId: "2",
        schedule: rawMockSchedule2,
        semesterType: "Semester",
        semester: "2566/2",
        isPublic: true
    },
    {
        name: "ปี 3 เทอม 1",
        scheduleId: "3",
        schedule: rawMockSchedule3,
        semesterType: "Semester",
        semester: "2567/1",
        isPublic: false
    }
];

// ---------------------------------------------------------
// ADAPTER & EXPORTS
// สร้าง Adapter เพื่อแปลงข้อมูลให้เข้ากับ Frontend เดิม
// ---------------------------------------------------------
const adaptCourse = (c: CourseMock) => {
    // 1. หาว่าวิชานี้เรียนวันไหนบ้าง (ดึงจากทุก Section มารวมกันแบบไม่ซ้ำ)
    const allDays = new Set<string>();
    Object.values(c.sections).forEach(classes => {
        classes.forEach(cls => allDays.add(cls.dayOfWeek));
    });

    // 2. แปลง GenEd เป็น Array (ถ้าเป็น NO ให้เป็น array ว่าง)
    const genedList = c.genEdType === "NO" ? [] : [c.genEdType];

    return {
        ...c,
        // Mapping ชื่อ Field ให้ตรงกับที่ Frontend เดิมเรียกใช้
        name: c.abbrName,   
        code: c.courseNo, 
        seat: c.regis,
        maxseat: c.max,
        
        // Field ที่เพิ่มมาใหม่สำหรับ CourseCard
        review: c.reviewCount,     // map reviewCount -> review
        gened: genedList,          // map genEdType -> gened []
        days: Array.from(allDays), // set -> array ["MO", "WE"]

        sections: Object.fromEntries(
            Object.entries(c.sections).map(([secNo, classes]) => [
                secNo,
                classes.map(cls => ({
                    ...cls,
                    day: cls.dayOfWeek 
                }))
            ])
        )
    };
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