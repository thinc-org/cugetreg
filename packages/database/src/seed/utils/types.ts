export type Period = {
  period: {
    start: string
    end: string
  }
  date: string
}

export type CourseSeed = {
  abbrName: string
  academicYear: string
  courseCondition: string
  courseDescEn: string
  courseDescTh: string
  courseNameEn: string
  courseNameTh: string
  courseNo: string
  createdAt: { $date: string }
  credit: number
  creditHours: string
  department: string
  faculty: string
  final?: Period
  genEdType: 'NO' | 'SC' | 'SO' | 'HU' | 'IN'
  midterm?: Period
  sections: SectionSeed[]
  semester: '1' | '2' | '3'
  studyProgram: 'S' | 'T' | 'I'
  updatedAt: { $date: string }
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
  _id: ObjectId
  courseCart: CourseCart | null
  email: string
  google: GoogleSeed
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
  interactions: Interaction[]
  ownerId: ObjectId
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
