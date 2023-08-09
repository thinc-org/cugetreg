
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export type DayOfWeek = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU" | "IA" | "AR";
export type StudyProgram = "S" | "T" | "I";
export type GenEdType = "SO" | "HU" | "SC" | "IN" | "NO";
export type GradingType = "SU" | "LETTER";
export type ReviewInteractionType = "L" | "D";
export type ReviewStatus = "APPROVED" | "REJECTED" | "PENDING";

export class CourseEntryInput {
    courseId: string;
    studyProgram: string;
}

export class CourseRecommendationRequest {
    variant: string;
    semesterKey: CourseGroupInput;
    selectedCourses: CourseKeyInput[];
}

export class CourseKeyInput {
    courseNo: string;
    semesterKey: CourseGroupInput;
}

export class PeriodRangeInput {
    start: string;
    end: string;
}

export class FilterInput {
    keyword?: Nullable<string>;
    genEdTypes?: Nullable<GenEdType[]>;
    gradingTypes?: Nullable<GradingType[]>;
    dayOfWeeks?: Nullable<DayOfWeek[]>;
    periodRange?: Nullable<PeriodRangeInput>;
    limit?: Nullable<number>;
    offset?: Nullable<number>;
}

export class CourseGroupInput {
    semester: string;
    academicYear: string;
    studyProgram: StudyProgram;
}

export class OverrideInput {
    courseNo: string;
    genEdType: GenEdType;
}

export class CreateReviewInput {
    rating: number;
    courseNo: string;
    semester: string;
    academicYear: string;
    studyProgram: StudyProgram;
    content?: Nullable<string>;
}

export class EditReviewInput {
    rating?: Nullable<number>;
    semester?: Nullable<string>;
    academicYear?: Nullable<string>;
    content?: Nullable<string>;
}

export class CourseCartItemInput {
    studyProgram: StudyProgram;
    academicYear: string;
    courseNo: string;
    semester: string;
    selectedSectionNo: string;
    isHidden: boolean;
    color?: Nullable<string>;
}

export abstract class IQuery {
    abstract recommend(req: CourseRecommendationRequest): CourseRecommendationResponse | Promise<CourseRecommendationResponse>;

    abstract courseNos(): Nullable<CourseNosOutput> | Promise<Nullable<CourseNosOutput>>;

    abstract course(courseNo: string, courseGroup: CourseGroupInput): Course | Promise<Course>;

    abstract search(filter: FilterInput, courseGroup: CourseGroupInput): Course[] | Promise<Course[]>;

    abstract overrides(): Override[] | Promise<Override[]>;

    abstract reviews(courseNo: string, studyProgram: StudyProgram): Review[] | Promise<Review[]>;

    abstract myPendingReviews(courseNo: string, studyProgram: StudyProgram): Review[] | Promise<Review[]>;

    abstract pendingReviews(): Review[] | Promise<Review[]>;

    abstract me(): Nullable<User> | Promise<Nullable<User>>;

    abstract courseCart(): Nullable<CourseCartItem[]> | Promise<Nullable<CourseCartItem[]>>;
}

export class CourseEntry {
    courseId: string;
    studyProgram: string;
}

export class SemesterKey {
    studyProgram: string;
    semester: string;
    academicYear: string;
}

export class CourseKey {
    courseNo: string;
    semesterKey: SemesterKey;
}

export class CourseDetail {
    key: CourseKey;
    courseNameEn: string;
}

export class CourseRecommendationResponse {
    courses: CourseDetail[];
}

export class Period {
    start?: Nullable<string>;
    end?: Nullable<string>;
}

export class ExamPeriod {
    date?: Nullable<string>;
    period?: Nullable<Period>;
}

export class Capacity {
    current: number;
    max: number;
}

export class Class {
    type: string;
    dayOfWeek?: Nullable<DayOfWeek>;
    period?: Nullable<Period>;
    building?: Nullable<string>;
    room?: Nullable<string>;
    teachers: string[];
}

export class Section {
    sectionNo: string;
    closed: boolean;
    capacity: Capacity;
    note?: Nullable<string>;
    classes: Class[];
    genEdType: GenEdType;
}

export class Course {
    studyProgram: StudyProgram;
    semester: string;
    academicYear: string;
    courseNo: string;
    courseDescTh?: Nullable<string>;
    courseDescEn?: Nullable<string>;
    abbrName: string;
    courseNameTh: string;
    courseNameEn: string;
    faculty: string;
    department: string;
    credit: number;
    creditHours: string;
    courseCondition: string;
    genEdType: GenEdType;
    midterm?: Nullable<ExamPeriod>;
    final?: Nullable<ExamPeriod>;
    sections: Section[];
    rating?: Nullable<string>;
    courseDesc?: Nullable<string>;
}

export class CourseNosOutput {
    S: string[];
    T: string[];
    I: string[];
}

export class Override {
    courseNo: string;
    genEdType: GenEdType;
}

export abstract class IMutation {
    abstract createOrUpdateOverride(override: OverrideInput): Override | Promise<Override>;

    abstract deleteOverride(courseNo: string): Nullable<Override> | Promise<Nullable<Override>>;

    abstract createReview(createReviewInput: CreateReviewInput): Review | Promise<Review>;

    abstract removeReview(reviewId: string): Review | Promise<Review>;

    abstract editMyReview(reviewId: string, review: EditReviewInput): Review | Promise<Review>;

    abstract setReviewInteraction(reviewId: string, interactionType: ReviewInteractionType): Review | Promise<Review>;

    abstract setReviewStatus(reviewId: string, status: ReviewStatus, rejectionReason?: Nullable<string>): string | Promise<string>;

    abstract modifyCourseCart(newContent: CourseCartItemInput[]): Nullable<CourseCartItem[]> | Promise<Nullable<CourseCartItem[]>>;
}

export class Review {
    _id: string;
    rating: number;
    courseNo: string;
    semester: string;
    academicYear: string;
    studyProgram: StudyProgram;
    content?: Nullable<string>;
    likeCount: number;
    dislikeCount: number;
    myInteraction?: Nullable<ReviewInteractionType>;
    status?: Nullable<ReviewStatus>;
    rejectionReason?: Nullable<string>;
    isOwner: boolean;
}

export class User {
    _id: string;
    name: string;
}

export class CourseCartItem {
    studyProgram: string;
    academicYear: string;
    courseNo: string;
    semester: string;
    selectedSectionNo: string;
    isHidden: boolean;
    color?: Nullable<string>;
}

type Nullable<T> = T | null;
