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
  about: 'เกี่ยวกับเรา',
  signin: 'เข้าสู่ระบบ',
  signout: 'ออกจากระบบ',
}

export const studyProgram = {
  S: 'ทวิภาค',
  T: 'ตรีภาค',
  I: 'นานาชาติ',
}

export const annuncementSearch = {
  search: 'ค้นหา',
  searchPlaceholder: 'ค้นหาหัวข้อ/เนื้อหา',
}

// Shopping Panel
export const shoppingPanel = {
  selectedCourse: 'วิชาที่เลือก',
  totalCredit: 'รวม {{totalCredit}} หน่วยกิต',
  credit: '{{credit}} หน่วยกิต',
  creditAbbr: '{{credit}} นก.',
  genedCourse: 'วิชา GenEd',
  otherCourse: 'วิชาอื่น ๆ',
  makeSchedule: {
    default: 'จัดตารางเรียน',
    delete: 'นำออก {{number}} รายการ ',
  },
  empty: 'คุณยังไม่ได้เลือกวิชา',
}

export const schedulePage = {
  title: 'จัดตารางเรียน',
  downloadPng: 'PNG',
  addToCalendar: 'ตารางเรียน (Soon)',
  showCR11: 'แสดง จท11',
  showCR11Mobile: 'จท11',
  sumCreditsDesc: 'หน่วยกิตรวมในตาราง',
  sumCredits: '{{credits}} หน่วยกิต',
  classSchedule: 'ตารางเรียน',
  examSchedule: 'ตารางสอบ',
  removeSubjectSuccess: 'ลบรายวิชาสำเร็จ',
  undo: 'เลิกทำ',
}

export const scheduleTableCard = {
  credits: '[{{credits}} หน่วยกิต]',
  sectionLabel: 'Sec {{section}}',
  delete: 'ลบ',
  teacher: 'ผู้สอน',
  time: 'เวลา',
  classRoom: 'ห้องเรียน',
  classType: 'รูปแบบ',
  and: 'และ',
  classOverlap: 'เวลาเรียนชนกับ',
  examOverlap: 'เวลาสอบชนกับ',
  selectColor: 'สีในตาราง',
}

export const courseDialog = {
  ...scheduleTableCard,
  midtermExam: 'สอบกลางภาค',
  finalExam: 'สอบปลายภาค',
  selectColor: 'เลือกสีในตาราง',
  hide: 'ซ่อนจากตาราง',
  show: 'แสดงในตาราง',
  remove: 'นำออกจากวิชาที่เลือก',
}

export const schedule = {
  dateTime: 'Day/Time',
  days: {
    MO: 'MON',
    TU: 'TUE',
    WE: 'WED',
    TH: 'THU',
    FR: 'FRI',
    SA: 'SAT',
    SU: 'SUN',
    IA: 'IA',
    AR: 'AR',
  },
}

export const courseCard = {
  select: 'เลือก',
  credit: '[{{credit}} หน่วยกิต]',
  classDay: 'วันที่เรียน',
  genEd: 'GenEd',
  totalCapacity: 'จำนวนที่ว่างรวม',
  condition: 'เงื่อนไข',
  rating: 'Rating',
  teacher: 'ผู้สอน',
  time: 'เวลา',
  classRoom: 'ห้องเรียน',
  type: 'รูปแบบ',
  note: 'หมายเหตุ',
  capacity: 'ที่ว่าง',
  addSubjectSuccess: 'เพิ่มรายวิชาสำเร็จ',
  addSubjectFailed: 'โปรดลบวิชาจากแผนการเรียนอื่นออกก่อนเพื่อเพิมวิชาจากแผนการเรียนนี้',
  addSubjectFailedSolution: 'แก้ไขวิชา',
  removeSubjectSuccess: 'ลบรายวิชาสำเร็จ',
  viewAllSubject: 'ดูวิชาทั้งหมด',
  unknownCount: 'ไม่ทราบจำนวน',
}

export const sectionCard = {
  select: 'เลือก',
  section: 'Sec {{sectionNo}}',
  teacher: 'ผู้สอน',
  time: 'วันเวลาเรียน',
  classRoom: 'ห้องเรียน',
  classType: 'รูปแบบ',
  closed: 'ปิด',
  available: '{{current}}/{{max}}',
  full: '{{current}}/{{max}}',
  unknownSeat: 'ไม่ทราบจำนวนที่นั่ง',
}

export const footer = {
  university: 'จุฬาลงกรณ์มหาวิทยาลัย',
  topButton: 'กลับด้านบน',
  github: 'Open Source on',
}

export const program = {
  I: 'นานาชาติ',
  S: 'ทวิภาค',
  T: 'ตรีภาค',
}

export const cr11 = {
  semester: 'ปีการศึกษา',
  enrollingSubject: 'รายวิชาที่ต้องการลงทะเบียนเรียน',
  simulateDocument: 'จำลองเอกสาร แสดงความจำนงขอลงทะเบียนเรียน (จท11)',
  total: 'ทั้งหมดนี้',
  not: 'ไม่ใช่',
  realRegistration: 'การลงทะเบียนเรียนจริง',
  explanation: 'CU Get Reg เป็นเพียงแอปพลิเคชันที่ใช้อำนวยความสะดวกในการจัดตารางสอนเท่านั้น',
  explanation2: 'คุณสามารถลงทะเบียนเรียนได้ที่',
  only: 'เท่านั้น',
  order: 'ลำดับที่',
  courseNo: 'รหัสรายวิชา',
  courseNoMobile: 'รหัสวิชา',
  abbrName: 'ชื่อย่อรายวิชา',
  section: 'ตอนเรียน',
  credit: 'หน่วยกิต',
  creditMobile: 'หน่วย',
  totalCredit: 'หน่วยกิตรวม',
}

export const examSchedule = {
  midterm: 'กลางภาค',
  final: 'ปลายภาค',
}

export const selectedCoursesButton = {
  main: 'วิชาที่เลือก',
  mainShort: 'เลือก',
}

export const navigation = {
  back: 'กลับ',
}

export const syncStatus = {
  syncing: 'กำลังซิงค์',
  synced: 'ซิงค์สำเร็จ',
  syncerr: 'การซิงค์ล้มเหลว',
}

export const regWarNotice = {
  notice: 'จำนวนที่นั่งอาจล่าช้าจาก Reg Chula',
}

export const filterBar = {
  periodRange: 'เวลาเรียน',
  fromTime: 'ในช่วง',
  toTime: 'ถึง',
}

export const tagList = {
  inRange: 'ในช่วง',
}

export const courseThumbnail = {
  closed: 'ปิดทุกเซค',
  available: '{{current}}/{{max}}',
  full: '{{current}}/{{max}}',
  SO: 'หมวดสังคม',
  SC: 'หมวดวิทย์',
  HU: 'หมวดมนุษย์',
  IN: 'หมวดสหฯ',
}

export const review = {
  title: 'มาเขียนรีวิวรายวิชากันเถอะ!',
  subtitle: '*การรีวิวนี้จะเป็นแบบไม่ระบุตัวตน',
  cancel: 'ยกเลิก',
  submit: 'ส่งรีวิว',
}

export const colorPicker = {
  selectColorFor: 'เลือกสีในตาราง วิชา {{abbrName}}',
  select: 'เลือกสี',
}
