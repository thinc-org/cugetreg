export type CourseSeed = {
  abbrName: string
  academicYear: string
  courseCondition: string
  courseDescEn: string
  courseDescTh: string
  courseNameEn: string
  courseNameTh: string
  courseNo: string
  createdAt: string
  credit: number
  creditHours: string
  department: string
  faculty: string
  final: string
  genEdType: 'NO' | 'SC' | 'SO' | 'HU' | 'IN'
  midterm: string
  sections: string
  semester: '1' | '2' | '3'
  studyProgram: 'S' | 'T' | 'I'
  updatedAt: string
}

export type SectionSeed = {
  sectionNo: string
  closed: boolean
  note: string
  genEdType: 'NO' | 'SC' | 'SO' | 'HU' | 'IN'
  classes: {
    room: string
    dayOfWeek: 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU' | 'AR' | 'IA'
    teachers: string[]
    building: string
    period: {
      start: string
      end: string
    }
    type: string
  }[]
  capacity: {
    current: number
    max: number
  }
}
