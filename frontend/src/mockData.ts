import type { Course, ScheduleData } from "./types.ts";

const courseComPres: Course = {
    name: "COMM PRES SKILL",
    code: "5501214",
    credit: 3,
    gened: [],
    seat: 25,
    maxseat: 25,
    sections: {
        6: [{
            day: "MO",
            startTime: 13,
            duration: 3,
            building: "ENG4",
            room: "M07/4"
        }],
        1: [{
            day: "WE",
            startTime: 13,
            duration: 3,
            building: "ENG3",
            room: "319"
        }]
    }
}

const courseAppDev: Course = {
    name: "APP DEV",
    code: "2190512",
    credit: 3,
    gened: [],
    seat: 25,
    maxseat: 55,
    sections: {
        1: [{
            day: "TU",
            startTime: 9,
            duration: 3,
            building: "ENG2",
            room: "210"
        }],
        2: [{
            day: "WE",
            startTime: 9,
            duration: 3,
            building: "ENG2",
            room: "210"
        }]
    }
}

const courseEffectCareer: Course = {
    name: "EFFECT CAREER MGT",
    code: "0201171",
    credit: 3,
    gened: ["SO"],
    seat: 15,
    maxseat: 30,
    sections: {
        71: [{
            day: "TH",
            startTime: 9,
            duration: 3,
            building: "AR",
            room: "AR"
        }],
        73: [{
            day: "TH",
            startTime: 13,
            duration: 3,
            building: "ENG2",
            room: "210"
        }]
    }
}

const courseCalculusI: Course = {
    name: "Calculus I",
    code: "0201171",
    credit: 3,
    gened: [],
    seat: 15,
    maxseat: 30,
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
        ]
    }
}

const mockSchedule: ScheduleData = [
    {
        id: 1,
        course: courseComPres,
        selectedSection: 6,
        hidden: false
    },
    {
        id: 2,
        course: courseAppDev,
        selectedSection: 1,
        hidden: false
    },
    {
        id: 3,
        course: courseEffectCareer,
        selectedSection: 71,
        hidden: false
    },
    {
        id: 4,
        course: courseCalculusI,
        selectedSection: 1,
        hidden: false
    },
]

export {
    courseCalculusI,
    courseEffectCareer,
    courseAppDev,
    courseComPres,
    mockSchedule
};
