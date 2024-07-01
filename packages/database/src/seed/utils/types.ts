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

export type ObjectId = {
  $oid: string
}

export type UserSeed = {
  _id: string // ObjectId
  courseCart: string | null // CourseCart
  email: string
  google: string
  name: string
}

export type GoogleSeed = {
  googleId: string
  hasMigratedGDrive: boolean
}

export type CourseCart = {
  cartContent: CartContent[]
}

export type CartContent = {
  selectedSectionNo: string
  isHidden: boolean
  courseNo: string
  semester: '1' | '2' | '3'
  studyProgram: 'S' | 'T' | 'I'
  color: string
  academicYear: string
}

export type ReviewSeed = {
  academicYear: string
  content: string
  courseNo: string
  interactions: string // Interaction[]
  ownerId: string // ObjectId
  rating: number
  rejectionReason: string | null
  semester: '1' | '2' | '3'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  studyProgram: 'S' | 'T' | 'I'
}

export type Interaction = {
  userId: ObjectId
  type: 'L' | 'D'
}
