// Course Interface

export interface MongoDate {
  $date: string;
}

export interface MongoId {
  $oid: string;
}

export interface Period {
  start: string; // e.g. "13:30"
  end: string;
}

export interface ExamInfo {
  period: Period;
  date: string; // pass to parseExamDate
}

export interface ClassInfo {
  _id: MongoId;
  type: string;
  dayOfWeek: string;
  period: Period;
  building?: string;
  room?: string;
  teachers: string[];
}

export interface Section {
  _id: MongoId;
  sectionNo: string;
  closed: boolean;
  capacity: {
    current: number;
    max: number;
  };
  note?: string;
  classes: ClassInfo[];
  genEdType: string;
}

export interface Course {
  _id: MongoId;
  courseNo: string;
  abbrName: string;
  courseNameTh: string;
  courseNameEn: string;
  courseDescTh?: string;
  courseDescEn?: string;
  courseCondition?: string;
  academicYear: string;
  semester: string;
  credit: number;
  creditHours?: string;
  department?: string;
  faculty?: string;
  genEdType: string;
  studyProgram: string;
  sections: Section[];
  midterm?: ExamInfo;
  final?: ExamInfo;
  updatedAt: MongoDate;
  createdAt?: MongoDate;
  rating?: string;
}

export interface CourseOverride {
  _id: MongoId;
  courseNo: string;
  genEdType: string;
}

// Review Interface

type ReviewStatus = "APPROVED" | "REJECTED" | "PENDING";

export interface Review {
  _id: MongoId;
  academicYear: string;
  content: string;
  courseNo: string;
  interactions: any[]; // Interaction how it look like ??
  ownerId: MongoId;
  rating: number;
  semester: string;
  status: ReviewStatus;
  studyProgram: string;
  rejectionReason?: string | null;
  updatedAt?: { $date: string };
  createdAt?: { $date: string };
}

// User Interface

interface GoogleInfo {
  googleId: string;
  hasMigratedGDrive: boolean;
  _id?: MongoId;
}

export interface MongoCartItem {
  studyProgram: string;
  academicYear: string;
  semester: string;
  courseNo: string;
  selectedSectionNo: string;
  isHidden: boolean;
  color: string;
  _id: MongoId;
  cartOrder: number;
}

interface MongoCourseCart {
  cartContent: MongoCartItem[];
  _id?: MongoId;
}

export interface MongoUser {
  _id: MongoId;
  __v: number;
  email: string;
  google: GoogleInfo;
  name: string;
  courseCart?: MongoCourseCart;
}
