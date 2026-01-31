import type {
  Course,
  ScheduleData,
  ScheduleList,
  ScheduleListItem,
} from "./types.ts";

const courseComPres: Course = {
  name: "COMM PRES SKILL",
  code: "5501214",
  credit: 3,
  gened: [],
  seat: 25,
  maxseat: 25,
  sections: {
    6: [
      {
        day: "MO",
        startTime: 13,
        duration: 3,
        building: "ENG4",
        room: "M07/4",
      },
    ],
    1: [
      {
        day: "WE",
        startTime: 13,
        duration: 3,
        building: "ENG3",
        room: "319",
      },
    ],
  },
  midterm: {
    date: new Date("2024-12-01T08:30:00"),
    duration: 3,
  },
  final: {
    date: new Date("2024-12-02T08:30:00"),
    duration: 3,
  },
};

const courseAppDev: Course = {
  name: "APP DEV",
  code: "2190512",
  credit: 3,
  gened: [],
  seat: 25,
  maxseat: 55,
  sections: {
    1: [
      {
        day: "TU",
        startTime: 9,
        duration: 3,
        building: "ENG2",
        room: "210",
      },
    ],
    2: [
      {
        day: "WE",
        startTime: 9,
        duration: 3,
        building: "ENG2",
        room: "210",
      },
    ],
  },
  midterm: {
    date: new Date("2024-12-03T08:30:00"),
    duration: 3,
  },
  final: {
    date: new Date("2024-12-04T13:00:00"),
    duration: 3,
  },
};

const courseEffectCareer: Course = {
  name: "EFFECT CAREER MGT",
  code: "0201171",
  credit: 3,
  gened: ["SO"],
  seat: 15,
  maxseat: 30,
  sections: {
    71: [
      {
        day: "TH",
        startTime: 9,
        duration: 3,
        building: "AR",
        room: "AR",
      },
    ],
    73: [
      {
        day: "TH",
        startTime: 13,
        duration: 3,
        building: "ENG2",
        room: "210",
      },
    ],
  },
  final: {
    date: new Date("2024-12-05T13:00:00"),
    duration: 3,
  },
};

const courseCalculusI: Course = {
  name: "CALCULUS I",
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
        room: "210",
      },
      {
        day: "WE",
        startTime: 8,
        duration: 1,
        building: "ENG2",
        room: "210",
      },
      {
        day: "TH",
        startTime: 8,
        duration: 1,
        building: "ENG2",
        room: "210",
      },
    ],
    2: [
      {
        day: "TU",
        startTime: 9,
        duration: 1,
        building: "ENG2",
        room: "210",
      },
      {
        day: "WE",
        startTime: 9,
        duration: 1,
        building: "ENG2",
        room: "210",
      },
      {
        day: "TH",
        startTime: 9,
        duration: 1,
        building: "ENG2",
        room: "210",
      },
    ],
  },
  midterm: {
    date: new Date("2024-12-03T13:00:00"),
    duration: 3,
  },
  final: {
    date: new Date("2024-12-04T08:30:00"),
    duration: 3,
  },
};

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
        room: "210",
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
  },
};

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
        room: "210",
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
  },
};

const mockSchedule: ScheduleData = [
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
  {
    id: 3,
    course: courseEffectCareer,
    selectedSection: 71,
    hidden: false,
    colorVariant: "green",
  },
  {
    id: 4,
    course: courseCalculusI,
    selectedSection: 1,
    hidden: false,
    colorVariant: "purple",
  },
  {
    id: 5,
    course: courseLongName,
    selectedSection: 1,
    hidden: false,
    colorVariant: "teal",
  },
  {
    id: 6,
    course: courseAI,
    selectedSection: 1,
    hidden: false,
    colorVariant: "teal",
  },
];

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
];

const mockSchedule2: ScheduleData = [
  {
    id: 3,
    course: courseEffectCareer,
    selectedSection: 71,
    hidden: false,
    colorVariant: "green",
  },
  {
    id: 4,
    course: courseCalculusI,
    selectedSection: 1,
    hidden: false,
    colorVariant: "purple",
  },
];

const mockSchedule3: ScheduleData = [
  {
    id: 5,
    course: courseLongName,
    selectedSection: 1,
    hidden: false,
    colorVariant: "teal",
  },
  {
    id: 6,
    course: courseAI,
    selectedSection: 1,
    hidden: false,
    colorVariant: "teal",
  },
];

const mockScheduleItem1: ScheduleListItem = {
  name: "ปี 2 เทอม 1",
  scheduleId: "1",
  schedule: mockSchedule1,
  semesterType: "Semester",
  semester: "2566/1",
  isPublic: false,
};

const mockScheduleItem2: ScheduleListItem = {
  name: "ปี 2 เทอม 2",
  scheduleId: "2",
  schedule: mockSchedule2,
  semesterType: "Semester",
  semester: "2566/2",
  isPublic: true,
};

const mockScheduleItem3: ScheduleListItem = {
  name: "ปี 3 เทอม 1",
  scheduleId: "3",
  schedule: mockSchedule3,
  semesterType: "Semester",
  semester: "2567/1",
  isPublic: false,
};

const mockScheduleList: ScheduleList = [
  mockScheduleItem1,
  mockScheduleItem2,
  mockScheduleItem3,
];

export {
  courseAI,
  courseAppDev,
  courseCalculusI,
  courseComPres,
  courseEffectCareer,
  courseLongName,
  mockSchedule,
  mockSchedule1,
  mockSchedule2,
  mockSchedule3,
  mockScheduleList,
};
