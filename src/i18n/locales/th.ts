import { ALL_CATEGORIES, ALL_FACULTIES, GENEDS, OTHER_CATEGORIES } from '@/utils/const'

// Default namespace
export const translation = {
  appName: 'CU Get Reg',
}

// Config bar
export const configBar = {
  reportAProblem: 'แจ้งปัญหา',
}

// Navigation bar
export const navBar = {
  news: 'ข่าวสาร',
  searchCourses: 'ค้นหาวิชาเรียน',
  timetable: 'จัดตารางเรียน',
  signin: 'เข้าสู่ระบบ',
}

export const announcement = {
  mainText: 'กระดานข่าวสาร',
  search: 'ค้นหา',
  searchPlaceholder: 'ค้นหาหัวข้อ/เนื้อหา',
}

// Shopping Panel
export const shoppingPanel = {
  selectedCourse: 'วิชาที่เลือก',
  totalCredit: 'รวม {{totalCredit}} หน่วยกิต',
  credit: '{{credit}} หน่วยกิต',
  genedCourse: 'วิชา GenEd',
  otherCourse: 'วิชาอื่น ๆ',
  makeSchedule: 'จัดตารางเรียน',
}

export const schedule = {
  dateTime: 'วัน/เวลา',
  days: {
    MO: 'MON',
    TU: 'TUE',
    WE: 'WED',
    TH: 'THU',
    FR: 'FRI',
    SA: 'SAT',
    SU: 'SUN',
  },
}

export const faculty = {
  key1: 'value1',
  key2: 'value2',
  [ALL_FACULTIES]: 'ทุกคณะ',
}

export const category = {
  [ALL_CATEGORIES]: 'ทุกประเภท',
  ...GENEDS,
  ...OTHER_CATEGORIES,
}
