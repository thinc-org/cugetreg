import gql from 'graphql-tag';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Capacity = {
  __typename?: 'Capacity';
  current: Scalars['Int'];
  max: Scalars['Int'];
};

export type Class = {
  __typename?: 'Class';
  building?: Maybe<Scalars['String']>;
  dayOfWeek?: Maybe<DayOfWeek>;
  period?: Maybe<Period>;
  room?: Maybe<Scalars['String']>;
  teachers: Array<Scalars['String']>;
  type: Scalars['String'];
};

export type Course = {
  __typename?: 'Course';
  abbrName: Scalars['String'];
  academicYear: Scalars['String'];
  courseCondition: Scalars['String'];
  /** @deprecated Use courseDescTh or courseDescEn instead */
  courseDesc?: Maybe<Scalars['String']>;
  courseDescEn?: Maybe<Scalars['String']>;
  courseDescTh?: Maybe<Scalars['String']>;
  courseNameEn: Scalars['String'];
  courseNameTh: Scalars['String'];
  courseNo: Scalars['String'];
  credit: Scalars['Float'];
  creditHours: Scalars['String'];
  department: Scalars['String'];
  faculty: Scalars['String'];
  final?: Maybe<ExamPeriod>;
  /** `GenEdType` of this course. If this course is not a GenEd course, the value will be `NO`. */
  genEdType: GenEdType;
  midterm?: Maybe<ExamPeriod>;
  rating?: Maybe<Scalars['String']>;
  sections: Array<Section>;
  semester: Scalars['String'];
  studyProgram: StudyProgram;
};

export type CourseCartItem = {
  __typename?: 'CourseCartItem';
  academicYear: Scalars['String'];
  color?: Maybe<Scalars['String']>;
  courseNo: Scalars['String'];
  isHidden: Scalars['Boolean'];
  /** The section no. that user selected for this course. */
  selectedSectionNo: Scalars['String'];
  semester: Scalars['String'];
  studyProgram: Scalars['String'];
};

export type CourseCartItemInput = {
  academicYear: Scalars['String'];
  color?: InputMaybe<Scalars['String']>;
  courseNo: Scalars['String'];
  isHidden: Scalars['Boolean'];
  /** The section no. that user selected for this course. */
  selectedSectionNo: Scalars['String'];
  semester: Scalars['String'];
  studyProgram: StudyProgram;
};

export type CourseDetail = {
  __typename?: 'CourseDetail';
  courseNameEn: Scalars['String'];
  key: CourseKey;
};

export type CourseEntry = {
  __typename?: 'CourseEntry';
  courseId: Scalars['String'];
  studyProgram: Scalars['String'];
};

export type CourseEntryInput = {
  courseId: Scalars['String'];
  studyProgram: Scalars['String'];
};

/** Combination of `semester`, `academicYear`, and `studyProgram`. Used to differentiate courses between time periods and program. */
export type CourseGroupInput = {
  academicYear: Scalars['String'];
  semester: Scalars['String'];
  studyProgram: StudyProgram;
};

export type CourseKey = {
  __typename?: 'CourseKey';
  courseNo: Scalars['String'];
  semesterKey: SemesterKey;
};

export type CourseKeyInput = {
  courseNo: Scalars['String'];
  semesterKey: CourseGroupInput;
};

/** List of all course nos. in all `studyPrograms`. */
export type CourseNosOutput = {
  __typename?: 'CourseNosOutput';
  I: Array<Scalars['String']>;
  S: Array<Scalars['String']>;
  T: Array<Scalars['String']>;
};

export type CourseRecommendationRequest = {
  selectedCourses: Array<CourseKeyInput>;
  semesterKey: CourseGroupInput;
  variant: Scalars['String'];
};

export type CourseRecommendationResponse = {
  __typename?: 'CourseRecommendationResponse';
  courses: Array<CourseDetail>;
};

/** Review data for creating a review. Course no. and `studyProgram` cannot be changed later. */
export type CreateReviewInput = {
  academicYear: Scalars['String'];
  content?: InputMaybe<Scalars['String']>;
  courseNo: Scalars['String'];
  /** Rating of the course. Value must be in range [0, 10] */
  rating: Scalars['Int'];
  semester: Scalars['String'];
  studyProgram: StudyProgram;
};

export enum DayOfWeek {
  /** To be Arranged (Faculty will announce later) */
  Ar = 'AR',
  Fr = 'FR',
  /** Individually Arranged (Different for each student) */
  Ia = 'IA',
  Mo = 'MO',
  Sa = 'SA',
  Su = 'SU',
  Th = 'TH',
  Tu = 'TU',
  We = 'WE'
}

/** Review data for editing a review. Fields that are not specified will not be changed. */
export type EditReviewInput = {
  academicYear?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  /** Rating of the course. Value must be in range [0, 10] */
  rating?: InputMaybe<Scalars['Int']>;
  semester?: InputMaybe<Scalars['String']>;
};

/** Pair of exam date and period. */
export type ExamPeriod = {
  __typename?: 'ExamPeriod';
  /** Date of the exam. The value is formatted as ISO8601 representation: `YYYY-MM-DDT00:00:00.000Z`. */
  date?: Maybe<Scalars['String']>;
  period?: Maybe<Period>;
};

/** Filters for searching courses. If a filter is not specified, it will not be used in the search. */
export type FilterInput = {
  /** List of `DayOfWeeks`. This filter is passed IF ANY of the course's sections have class in ANY of the `dayOfWeeks` in the list. */
  dayOfWeeks?: InputMaybe<Array<DayOfWeek>>;
  /** List of `GenEdTypes`. This filter is passed IF the course's `genEdType` matches ANY of the `genEdTypes` in the list. */
  genEdTypes?: InputMaybe<Array<GenEdType>>;
  /** List of `GradingTypes`. This filter is passed IF the course's has S/U in Credit Hours. If both filter are given, filters have no effect. */
  gradingTypes?: InputMaybe<Array<GradingType>>;
  /**
   * Keyword to search for courses. This filter is passed IF any of  `courseNo`, `abbrName`,
   * `courseNameTh`, or `courseNameEn` contains the keyword as a substring (except for `courseNo`
   * which checks if value **starts with** the keyword).
   */
  keyword?: InputMaybe<Scalars['String']>;
  /** Number of courses to return in this query. Used for pagination. */
  limit?: InputMaybe<Scalars['Int']>;
  /** Number of courses to skip through. Used for pagination. */
  offset?: InputMaybe<Scalars['Int']>;
  /**
   * Range of the classes' period. This filter is passed IF ANY of the course's sections
   * have class that intersects with the `periodRange`.
   */
  periodRange?: InputMaybe<PeriodRangeInput>;
};

export enum GenEdType {
  /** Humanities */
  Hu = 'HU',
  /** Interdisciplinary */
  In = 'IN',
  /** Not GenEd */
  No = 'NO',
  /** Science-Mathematics */
  Sc = 'SC',
  /** Social Science */
  So = 'SO'
}

export enum GradingType {
  /** Letter Grade */
  Letter = 'LETTER',
  /** S/U */
  SU = 'S_U'
}

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Create a new override. If override already exists, update it.
   * Requires admin authentication.
   */
  createOrUpdateOverride: Override;
  /**
   * Creates a new review for a course. New reviews will be in `PENDING` status, and must be approved by admins before they are visible to the public.
   * Requires user authentication.
   */
  createReview: Review;
  /**
   * Delete an override.
   *
   * Requires admin authentication.
   */
  deleteOverride?: Maybe<Override>;
  /**
   * Edit a review. User can only edit their own reviews. Fields that are not specified will not be changed. Review will be set to `PENDING` status,
   * and must be approved by admins before it is visible to the public.
   *
   * Requires user authentication.
   */
  editMyReview: Review;
  /** Modifies current user's course cart. */
  modifyCourseCart?: Maybe<Array<CourseCartItem>>;
  /**
   * Removes a review. User can only remove their own reviews.
   *
   * Requires user authentication.
   */
  removeReview: Review;
  /**
   * Like (L) / Dislike (D) a review. User can call this mutation again with same interaction to undo their interaction.
   *
   * Requires user authentication.
   */
  setReviewInteraction: Review;
  /**
   * Approve / Reject a review. Approved reviews are visible to the public. Rejected reviews are not visible to the public, but owner can see that it is rejected.
   * Owner must edit their review and resubmit for approval.
   *
   * Requires admin authentication.
   */
  setReviewStatus: Scalars['String'];
};


export type MutationCreateOrUpdateOverrideArgs = {
  override: OverrideInput;
};


export type MutationCreateReviewArgs = {
  createReviewInput: CreateReviewInput;
};


export type MutationDeleteOverrideArgs = {
  courseNo: Scalars['String'];
};


export type MutationEditMyReviewArgs = {
  review: EditReviewInput;
  reviewId: Scalars['String'];
};


export type MutationModifyCourseCartArgs = {
  newContent: Array<CourseCartItemInput>;
};


export type MutationRemoveReviewArgs = {
  reviewId: Scalars['String'];
};


export type MutationSetReviewInteractionArgs = {
  interactionType: ReviewInteractionType;
  reviewId: Scalars['String'];
};


export type MutationSetReviewStatusArgs = {
  rejectionReason?: InputMaybe<Scalars['String']>;
  reviewId: Scalars['String'];
  status: ReviewStatus;
};

/** Course override for overriding course info from Reg Chula during course scraping. */
export type Override = {
  __typename?: 'Override';
  courseNo: Scalars['String'];
  genEdType: GenEdType;
};

/** Course override for overriding course info from Reg Chula during course scraping. */
export type OverrideInput = {
  courseNo: Scalars['String'];
  genEdType: GenEdType;
};

/** Pair of start and end time. Format is `HH:MM`. */
export type Period = {
  __typename?: 'Period';
  end?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
};

/** Filter for searching courses that have class inside the given time period. */
export type PeriodRangeInput = {
  end: Scalars['String'];
  start: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Find a course and returns it */
  course: Course;
  /**
   * Returns current user's course cart.
   *
   * Requires user authentication.
   */
  courseCart?: Maybe<Array<CourseCartItem>>;
  /** Returns a list of all course nos. */
  courseNos?: Maybe<CourseNosOutput>;
  /**
   * Returns current user.
   * Requires user authentication.
   */
  me?: Maybe<User>;
  /**
   * Returns current user's reviews with status `PENDING` for a course.
   *
   * Requires user authentication.
   */
  myPendingReviews: Array<Review>;
  overrides: Array<Override>;
  /**
   * Returns all `PENDING` reviews.
   *
   * Requires admin authentication.
   */
  pendingReviews: Array<Review>;
  recommend: CourseRecommendationResponse;
  /** Returns all reviews for a course. Courses with same course no. but different `studyProgram` have different reviews. */
  reviews: Array<Review>;
  /** Search courses using the given course filters. Supports pagination with limit and offset fields in `FilterInput`. */
  search: Array<Course>;
};


export type QueryCourseArgs = {
  courseGroup: CourseGroupInput;
  courseNo: Scalars['String'];
};


export type QueryMyPendingReviewsArgs = {
  courseNo: Scalars['String'];
  studyProgram: StudyProgram;
};


export type QueryRecommendArgs = {
  req: CourseRecommendationRequest;
};


export type QueryReviewsArgs = {
  courseNo: Scalars['String'];
  studyProgram: StudyProgram;
};


export type QuerySearchArgs = {
  courseGroup: CourseGroupInput;
  filter: FilterInput;
};

export type Review = {
  __typename?: 'Review';
  _id: Scalars['String'];
  academicYear: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  courseNo: Scalars['String'];
  /** Number of users that disliked this review. */
  dislikeCount: Scalars['Int'];
  isOwner: Scalars['Boolean'];
  /** Number of users that liked this review. */
  likeCount: Scalars['Int'];
  /** Interaction type of current user on this review. `null` if user is not logged in. */
  myInteraction?: Maybe<ReviewInteractionType>;
  rating: Scalars['Int'];
  rejectionReason?: Maybe<Scalars['String']>;
  semester: Scalars['String'];
  status?: Maybe<ReviewStatus>;
  studyProgram: StudyProgram;
};

/** User interaction on a review. */
export enum ReviewInteractionType {
  /** Dislike */
  D = 'D',
  /** Like */
  L = 'L'
}

/** Status of a review. */
export enum ReviewStatus {
  /** Approved reviews are visible to the public. */
  Approved = 'APPROVED',
  /** Initial status for all reviews. Pending reviews are not visible to the public, and must be approved or rejected  by admins. */
  Pending = 'PENDING',
  /** Rejected review are NOT visible to the public. Owners must edit and re-submit the review. */
  Rejected = 'REJECTED'
}

export type Section = {
  __typename?: 'Section';
  capacity: Capacity;
  classes: Array<Class>;
  closed: Scalars['Boolean'];
  /** `GenEdType` of this section. If this section is not a GenEd section, the value will be `NO`. */
  genEdType: GenEdType;
  note?: Maybe<Scalars['String']>;
  sectionNo: Scalars['String'];
};

export type SemesterKey = {
  __typename?: 'SemesterKey';
  academicYear: Scalars['String'];
  semester: Scalars['String'];
  studyProgram: Scalars['String'];
};

export enum StudyProgram {
  /** International */
  I = 'I',
  /** Semester */
  S = 'S',
  /** Trimester */
  T = 'T'
}

export type User = {
  __typename?: 'User';
  _id: Scalars['String'];
  name: Scalars['String'];
};

export type GetCourseInfoQueryVariables = Exact<{
  courseNo: Scalars['String'];
  courseGroup: CourseGroupInput;
}>;


export type GetCourseInfoQuery = { __typename?: 'Query', course: { __typename?: 'Course', studyProgram: StudyProgram, semester: string, academicYear: string, courseNo: string, abbrName: string, courseNameTh: string, courseNameEn: string, faculty: string, department: string, credit: number, creditHours: string, courseCondition: string, courseDescTh?: string | null, courseDescEn?: string | null, genEdType: GenEdType, midterm?: { __typename?: 'ExamPeriod', date?: string | null, period?: { __typename?: 'Period', start?: string | null, end?: string | null } | null } | null, final?: { __typename?: 'ExamPeriod', date?: string | null, period?: { __typename?: 'Period', start?: string | null, end?: string | null } | null } | null, sections: Array<{ __typename?: 'Section', genEdType: GenEdType, sectionNo: string, closed: boolean, note?: string | null, capacity: { __typename?: 'Capacity', current: number, max: number }, classes: Array<{ __typename?: 'Class', type: string, dayOfWeek?: DayOfWeek | null, room?: string | null, building?: string | null, teachers: Array<string>, period?: { __typename?: 'Period', start?: string | null, end?: string | null } | null }> }> } };

export type GetCourseForThumbnailQueryVariables = Exact<{
  courseNo: Scalars['String'];
  courseGroup: CourseGroupInput;
}>;


export type GetCourseForThumbnailQuery = { __typename?: 'Query', course: { __typename?: 'Course', courseNo: string, abbrName: string, courseNameTh: string, courseNameEn: string, genEdType: GenEdType, sections: Array<{ __typename?: 'Section', classes: Array<{ __typename?: 'Class', dayOfWeek?: DayOfWeek | null }> }> } };

export type RecommendCourseTextQueryVariables = Exact<{
  req: CourseRecommendationRequest;
}>;


export type RecommendCourseTextQuery = { __typename?: 'Query', recommend: { __typename?: 'CourseRecommendationResponse', courses: Array<{ __typename?: 'CourseDetail', courseNameEn: string, key: { __typename?: 'CourseKey', courseNo: string, semesterKey: { __typename?: 'SemesterKey', academicYear: string, semester: string, studyProgram: string } } }> } };

export type CourseDataFieldsFragment = { __typename?: 'Course', studyProgram: StudyProgram, semester: string, academicYear: string, courseNo: string, abbrName: string, courseNameTh: string, courseNameEn: string, faculty: string, department: string, credit: number, creditHours: string, courseCondition: string, courseDescTh?: string | null, courseDescEn?: string | null, genEdType: GenEdType, midterm?: { __typename?: 'ExamPeriod', date?: string | null, period?: { __typename?: 'Period', start?: string | null, end?: string | null } | null } | null, final?: { __typename?: 'ExamPeriod', date?: string | null, period?: { __typename?: 'Period', start?: string | null, end?: string | null } | null } | null, sections: Array<{ __typename?: 'Section', genEdType: GenEdType, sectionNo: string, closed: boolean, note?: string | null, capacity: { __typename?: 'Capacity', current: number, max: number }, classes: Array<{ __typename?: 'Class', type: string, dayOfWeek?: DayOfWeek | null, room?: string | null, building?: string | null, teachers: Array<string>, period?: { __typename?: 'Period', start?: string | null, end?: string | null } | null }> }> };

export type ReviewDataFieldsFragment = { __typename?: 'Review', _id: string, rating: number, courseNo: string, semester: string, academicYear: string, studyProgram: StudyProgram, content?: string | null, likeCount: number, dislikeCount: number, myInteraction?: ReviewInteractionType | null, status?: ReviewStatus | null, rejectionReason?: string | null, isOwner: boolean };

export type OverrideDataFieldsFragment = { __typename?: 'Override', courseNo: string, genEdType: GenEdType };

export type GetOverridesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOverridesQuery = { __typename?: 'Query', overrides: Array<{ __typename?: 'Override', courseNo: string, genEdType: GenEdType }> };

export type DeleteOverrideMutationVariables = Exact<{
  courseNo: Scalars['String'];
}>;


export type DeleteOverrideMutation = { __typename?: 'Mutation', deleteOverride?: { __typename?: 'Override', courseNo: string, genEdType: GenEdType } | null };

export type CreateReviewMutationVariables = Exact<{
  createReviewInput: CreateReviewInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview: { __typename?: 'Review', _id: string, rating: number, courseNo: string, semester: string, academicYear: string, studyProgram: StudyProgram, content?: string | null, likeCount: number, dislikeCount: number, myInteraction?: ReviewInteractionType | null, status?: ReviewStatus | null, rejectionReason?: string | null, isOwner: boolean } };

export type EditMyReviewMutationVariables = Exact<{
  reviewId: Scalars['String'];
  review: EditReviewInput;
}>;


export type EditMyReviewMutation = { __typename?: 'Mutation', editMyReview: { __typename?: 'Review', _id: string, rating: number, courseNo: string, semester: string, academicYear: string, studyProgram: StudyProgram, content?: string | null, likeCount: number, dislikeCount: number, myInteraction?: ReviewInteractionType | null, status?: ReviewStatus | null, rejectionReason?: string | null, isOwner: boolean } };

export type GetMyPendingReviewsQueryVariables = Exact<{
  courseNo: Scalars['String'];
  studyProgram: StudyProgram;
}>;


export type GetMyPendingReviewsQuery = { __typename?: 'Query', myPendingReviews: Array<{ __typename?: 'Review', _id: string, rating: number, courseNo: string, semester: string, academicYear: string, studyProgram: StudyProgram, content?: string | null, likeCount: number, dislikeCount: number, myInteraction?: ReviewInteractionType | null, status?: ReviewStatus | null, rejectionReason?: string | null, isOwner: boolean }> };

export type GetPendingReviewsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPendingReviewsQuery = { __typename?: 'Query', pendingReviews: Array<{ __typename?: 'Review', _id: string, rating: number, courseNo: string, semester: string, academicYear: string, studyProgram: StudyProgram, content?: string | null, likeCount: number, dislikeCount: number, myInteraction?: ReviewInteractionType | null, status?: ReviewStatus | null, rejectionReason?: string | null, isOwner: boolean }> };

export type GetReviewsQueryVariables = Exact<{
  courseNo: Scalars['String'];
  studyProgram: StudyProgram;
}>;


export type GetReviewsQuery = { __typename?: 'Query', reviews: Array<{ __typename?: 'Review', _id: string, rating: number, courseNo: string, semester: string, academicYear: string, studyProgram: StudyProgram, content?: string | null, likeCount: number, dislikeCount: number, myInteraction?: ReviewInteractionType | null, status?: ReviewStatus | null, rejectionReason?: string | null, isOwner: boolean }> };

export type RemoveReviewMutationVariables = Exact<{
  reviewId: Scalars['String'];
}>;


export type RemoveReviewMutation = { __typename?: 'Mutation', removeReview: { __typename?: 'Review', _id: string, rating: number, courseNo: string, semester: string, academicYear: string, studyProgram: StudyProgram, content?: string | null, likeCount: number, dislikeCount: number, myInteraction?: ReviewInteractionType | null, status?: ReviewStatus | null, rejectionReason?: string | null, isOwner: boolean } };

export type SetReviewInteractionMutationVariables = Exact<{
  reviewId: Scalars['String'];
  interactionType: ReviewInteractionType;
}>;


export type SetReviewInteractionMutation = { __typename?: 'Mutation', setReviewInteraction: { __typename?: 'Review', _id: string, rating: number, courseNo: string, semester: string, academicYear: string, studyProgram: StudyProgram, content?: string | null, likeCount: number, dislikeCount: number, myInteraction?: ReviewInteractionType | null, status?: ReviewStatus | null, rejectionReason?: string | null, isOwner: boolean } };

export type SetReviewStatusMutationVariables = Exact<{
  reviewId: Scalars['String'];
  status: ReviewStatus;
  rejectionReason?: InputMaybe<Scalars['String']>;
}>;


export type SetReviewStatusMutation = { __typename?: 'Mutation', setReviewStatus: string };

export type GetAllCourseNoQueryVariables = Exact<{
  filter: FilterInput;
  courseGroup: CourseGroupInput;
}>;


export type GetAllCourseNoQuery = { __typename?: 'Query', search: Array<{ __typename?: 'Course', courseNo: string }> };

export type SearchCourseQueryVariables = Exact<{
  filter: FilterInput;
  courseGroup: CourseGroupInput;
}>;


export type SearchCourseQuery = { __typename?: 'Query', search: Array<{ __typename?: 'Course', studyProgram: StudyProgram, semester: string, academicYear: string, courseNo: string, abbrName: string, courseNameTh: string, courseNameEn: string, faculty: string, department: string, credit: number, creditHours: string, courseCondition: string, courseDescTh?: string | null, courseDescEn?: string | null, genEdType: GenEdType, midterm?: { __typename?: 'ExamPeriod', date?: string | null, period?: { __typename?: 'Period', start?: string | null, end?: string | null } | null } | null, final?: { __typename?: 'ExamPeriod', date?: string | null, period?: { __typename?: 'Period', start?: string | null, end?: string | null } | null } | null, sections: Array<{ __typename?: 'Section', genEdType: GenEdType, sectionNo: string, closed: boolean, note?: string | null, capacity: { __typename?: 'Capacity', current: number, max: number }, classes: Array<{ __typename?: 'Class', type: string, dayOfWeek?: DayOfWeek | null, room?: string | null, building?: string | null, teachers: Array<string>, period?: { __typename?: 'Period', start?: string | null, end?: string | null } | null }> }> }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', _id: string, name: string } | null };

export type PushCourseCartMutationVariables = Exact<{
  items: Array<CourseCartItemInput> | CourseCartItemInput;
}>;


export type PushCourseCartMutation = { __typename?: 'Mutation', modifyCourseCart?: Array<{ __typename?: 'CourseCartItem', courseNo: string }> | null };

export type GetCourseCartQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCourseCartQuery = { __typename?: 'Query', courseCart?: Array<{ __typename?: 'CourseCartItem', studyProgram: string, academicYear: string, courseNo: string, semester: string, selectedSectionNo: string, isHidden: boolean, color?: string | null }> | null };

export const CourseDataFieldsFragmentDoc = gql`
    fragment CourseDataFields on Course {
  studyProgram
  semester
  academicYear
  courseNo
  abbrName
  courseNameTh
  courseNameEn
  faculty
  department
  credit
  creditHours
  courseCondition
  courseDescTh
  courseDescEn
  genEdType
  midterm {
    date
    period {
      start
      end
    }
  }
  final {
    date
    period {
      start
      end
    }
  }
  sections {
    genEdType
    sectionNo
    closed
    capacity {
      current
      max
    }
    note
    classes {
      type
      dayOfWeek
      period {
        start
        end
      }
      room
      building
      teachers
    }
  }
}
    `;
export const ReviewDataFieldsFragmentDoc = gql`
    fragment ReviewDataFields on Review {
  _id
  rating
  courseNo
  semester
  academicYear
  studyProgram
  content
  likeCount
  dislikeCount
  myInteraction
  status
  rejectionReason
  isOwner
}
    `;
export const OverrideDataFieldsFragmentDoc = gql`
    fragment OverrideDataFields on Override {
  courseNo
  genEdType
}
    `;
export const GetCourseInfoDocument = gql`
    query GetCourseInfo($courseNo: String!, $courseGroup: CourseGroupInput!) {
  course(courseNo: $courseNo, courseGroup: $courseGroup) {
    ...CourseDataFields
  }
}
    ${CourseDataFieldsFragmentDoc}`;

/**
 * __useGetCourseInfoQuery__
 *
 * To run a query within a React component, call `useGetCourseInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseInfoQuery({
 *   variables: {
 *      courseNo: // value for 'courseNo'
 *      courseGroup: // value for 'courseGroup'
 *   },
 * });
 */
export function useGetCourseInfoQuery(baseOptions: Apollo.QueryHookOptions<GetCourseInfoQuery, GetCourseInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseInfoQuery, GetCourseInfoQueryVariables>(GetCourseInfoDocument, options);
      }
export function useGetCourseInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseInfoQuery, GetCourseInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseInfoQuery, GetCourseInfoQueryVariables>(GetCourseInfoDocument, options);
        }
export type GetCourseInfoQueryHookResult = ReturnType<typeof useGetCourseInfoQuery>;
export type GetCourseInfoLazyQueryHookResult = ReturnType<typeof useGetCourseInfoLazyQuery>;
export type GetCourseInfoQueryResult = Apollo.QueryResult<GetCourseInfoQuery, GetCourseInfoQueryVariables>;
export const GetCourseForThumbnailDocument = gql`
    query GetCourseForThumbnail($courseNo: String!, $courseGroup: CourseGroupInput!) {
  course(courseNo: $courseNo, courseGroup: $courseGroup) {
    courseNo
    abbrName
    courseNameTh
    courseNameEn
    genEdType
    sections {
      classes {
        dayOfWeek
      }
    }
  }
}
    `;

/**
 * __useGetCourseForThumbnailQuery__
 *
 * To run a query within a React component, call `useGetCourseForThumbnailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseForThumbnailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseForThumbnailQuery({
 *   variables: {
 *      courseNo: // value for 'courseNo'
 *      courseGroup: // value for 'courseGroup'
 *   },
 * });
 */
export function useGetCourseForThumbnailQuery(baseOptions: Apollo.QueryHookOptions<GetCourseForThumbnailQuery, GetCourseForThumbnailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseForThumbnailQuery, GetCourseForThumbnailQueryVariables>(GetCourseForThumbnailDocument, options);
      }
export function useGetCourseForThumbnailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseForThumbnailQuery, GetCourseForThumbnailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseForThumbnailQuery, GetCourseForThumbnailQueryVariables>(GetCourseForThumbnailDocument, options);
        }
export type GetCourseForThumbnailQueryHookResult = ReturnType<typeof useGetCourseForThumbnailQuery>;
export type GetCourseForThumbnailLazyQueryHookResult = ReturnType<typeof useGetCourseForThumbnailLazyQuery>;
export type GetCourseForThumbnailQueryResult = Apollo.QueryResult<GetCourseForThumbnailQuery, GetCourseForThumbnailQueryVariables>;
export const RecommendCourseTextDocument = gql`
    query RecommendCourseText($req: CourseRecommendationRequest!) {
  recommend(req: $req) {
    courses {
      courseNameEn
      key {
        semesterKey {
          academicYear
          semester
          studyProgram
        }
        courseNo
      }
    }
  }
}
    `;

/**
 * __useRecommendCourseTextQuery__
 *
 * To run a query within a React component, call `useRecommendCourseTextQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecommendCourseTextQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecommendCourseTextQuery({
 *   variables: {
 *      req: // value for 'req'
 *   },
 * });
 */
export function useRecommendCourseTextQuery(baseOptions: Apollo.QueryHookOptions<RecommendCourseTextQuery, RecommendCourseTextQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecommendCourseTextQuery, RecommendCourseTextQueryVariables>(RecommendCourseTextDocument, options);
      }
export function useRecommendCourseTextLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecommendCourseTextQuery, RecommendCourseTextQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecommendCourseTextQuery, RecommendCourseTextQueryVariables>(RecommendCourseTextDocument, options);
        }
export type RecommendCourseTextQueryHookResult = ReturnType<typeof useRecommendCourseTextQuery>;
export type RecommendCourseTextLazyQueryHookResult = ReturnType<typeof useRecommendCourseTextLazyQuery>;
export type RecommendCourseTextQueryResult = Apollo.QueryResult<RecommendCourseTextQuery, RecommendCourseTextQueryVariables>;
export const GetOverridesDocument = gql`
    query GetOverrides {
  overrides {
    ...OverrideDataFields
  }
}
    ${OverrideDataFieldsFragmentDoc}`;

/**
 * __useGetOverridesQuery__
 *
 * To run a query within a React component, call `useGetOverridesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOverridesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOverridesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOverridesQuery(baseOptions?: Apollo.QueryHookOptions<GetOverridesQuery, GetOverridesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOverridesQuery, GetOverridesQueryVariables>(GetOverridesDocument, options);
      }
export function useGetOverridesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOverridesQuery, GetOverridesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOverridesQuery, GetOverridesQueryVariables>(GetOverridesDocument, options);
        }
export type GetOverridesQueryHookResult = ReturnType<typeof useGetOverridesQuery>;
export type GetOverridesLazyQueryHookResult = ReturnType<typeof useGetOverridesLazyQuery>;
export type GetOverridesQueryResult = Apollo.QueryResult<GetOverridesQuery, GetOverridesQueryVariables>;
export const DeleteOverrideDocument = gql`
    mutation DeleteOverride($courseNo: String!) {
  deleteOverride(courseNo: $courseNo) {
    ...OverrideDataFields
  }
}
    ${OverrideDataFieldsFragmentDoc}`;
export type DeleteOverrideMutationFn = Apollo.MutationFunction<DeleteOverrideMutation, DeleteOverrideMutationVariables>;

/**
 * __useDeleteOverrideMutation__
 *
 * To run a mutation, you first call `useDeleteOverrideMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOverrideMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOverrideMutation, { data, loading, error }] = useDeleteOverrideMutation({
 *   variables: {
 *      courseNo: // value for 'courseNo'
 *   },
 * });
 */
export function useDeleteOverrideMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOverrideMutation, DeleteOverrideMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOverrideMutation, DeleteOverrideMutationVariables>(DeleteOverrideDocument, options);
      }
export type DeleteOverrideMutationHookResult = ReturnType<typeof useDeleteOverrideMutation>;
export type DeleteOverrideMutationResult = Apollo.MutationResult<DeleteOverrideMutation>;
export type DeleteOverrideMutationOptions = Apollo.BaseMutationOptions<DeleteOverrideMutation, DeleteOverrideMutationVariables>;
export const CreateReviewDocument = gql`
    mutation CreateReview($createReviewInput: CreateReviewInput!) {
  createReview(createReviewInput: $createReviewInput) {
    ...ReviewDataFields
  }
}
    ${ReviewDataFieldsFragmentDoc}`;
export type CreateReviewMutationFn = Apollo.MutationFunction<CreateReviewMutation, CreateReviewMutationVariables>;

/**
 * __useCreateReviewMutation__
 *
 * To run a mutation, you first call `useCreateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReviewMutation, { data, loading, error }] = useCreateReviewMutation({
 *   variables: {
 *      createReviewInput: // value for 'createReviewInput'
 *   },
 * });
 */
export function useCreateReviewMutation(baseOptions?: Apollo.MutationHookOptions<CreateReviewMutation, CreateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReviewMutation, CreateReviewMutationVariables>(CreateReviewDocument, options);
      }
export type CreateReviewMutationHookResult = ReturnType<typeof useCreateReviewMutation>;
export type CreateReviewMutationResult = Apollo.MutationResult<CreateReviewMutation>;
export type CreateReviewMutationOptions = Apollo.BaseMutationOptions<CreateReviewMutation, CreateReviewMutationVariables>;
export const EditMyReviewDocument = gql`
    mutation EditMyReview($reviewId: String!, $review: EditReviewInput!) {
  editMyReview(reviewId: $reviewId, review: $review) {
    ...ReviewDataFields
  }
}
    ${ReviewDataFieldsFragmentDoc}`;
export type EditMyReviewMutationFn = Apollo.MutationFunction<EditMyReviewMutation, EditMyReviewMutationVariables>;

/**
 * __useEditMyReviewMutation__
 *
 * To run a mutation, you first call `useEditMyReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditMyReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editMyReviewMutation, { data, loading, error }] = useEditMyReviewMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *      review: // value for 'review'
 *   },
 * });
 */
export function useEditMyReviewMutation(baseOptions?: Apollo.MutationHookOptions<EditMyReviewMutation, EditMyReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditMyReviewMutation, EditMyReviewMutationVariables>(EditMyReviewDocument, options);
      }
export type EditMyReviewMutationHookResult = ReturnType<typeof useEditMyReviewMutation>;
export type EditMyReviewMutationResult = Apollo.MutationResult<EditMyReviewMutation>;
export type EditMyReviewMutationOptions = Apollo.BaseMutationOptions<EditMyReviewMutation, EditMyReviewMutationVariables>;
export const GetMyPendingReviewsDocument = gql`
    query GetMyPendingReviews($courseNo: String!, $studyProgram: StudyProgram!) {
  myPendingReviews(courseNo: $courseNo, studyProgram: $studyProgram) {
    ...ReviewDataFields
  }
}
    ${ReviewDataFieldsFragmentDoc}`;

/**
 * __useGetMyPendingReviewsQuery__
 *
 * To run a query within a React component, call `useGetMyPendingReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyPendingReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyPendingReviewsQuery({
 *   variables: {
 *      courseNo: // value for 'courseNo'
 *      studyProgram: // value for 'studyProgram'
 *   },
 * });
 */
export function useGetMyPendingReviewsQuery(baseOptions: Apollo.QueryHookOptions<GetMyPendingReviewsQuery, GetMyPendingReviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyPendingReviewsQuery, GetMyPendingReviewsQueryVariables>(GetMyPendingReviewsDocument, options);
      }
export function useGetMyPendingReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyPendingReviewsQuery, GetMyPendingReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyPendingReviewsQuery, GetMyPendingReviewsQueryVariables>(GetMyPendingReviewsDocument, options);
        }
export type GetMyPendingReviewsQueryHookResult = ReturnType<typeof useGetMyPendingReviewsQuery>;
export type GetMyPendingReviewsLazyQueryHookResult = ReturnType<typeof useGetMyPendingReviewsLazyQuery>;
export type GetMyPendingReviewsQueryResult = Apollo.QueryResult<GetMyPendingReviewsQuery, GetMyPendingReviewsQueryVariables>;
export const GetPendingReviewsDocument = gql`
    query GetPendingReviews {
  pendingReviews {
    ...ReviewDataFields
  }
}
    ${ReviewDataFieldsFragmentDoc}`;

/**
 * __useGetPendingReviewsQuery__
 *
 * To run a query within a React component, call `useGetPendingReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingReviewsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPendingReviewsQuery(baseOptions?: Apollo.QueryHookOptions<GetPendingReviewsQuery, GetPendingReviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPendingReviewsQuery, GetPendingReviewsQueryVariables>(GetPendingReviewsDocument, options);
      }
export function useGetPendingReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPendingReviewsQuery, GetPendingReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPendingReviewsQuery, GetPendingReviewsQueryVariables>(GetPendingReviewsDocument, options);
        }
export type GetPendingReviewsQueryHookResult = ReturnType<typeof useGetPendingReviewsQuery>;
export type GetPendingReviewsLazyQueryHookResult = ReturnType<typeof useGetPendingReviewsLazyQuery>;
export type GetPendingReviewsQueryResult = Apollo.QueryResult<GetPendingReviewsQuery, GetPendingReviewsQueryVariables>;
export const GetReviewsDocument = gql`
    query GetReviews($courseNo: String!, $studyProgram: StudyProgram!) {
  reviews(courseNo: $courseNo, studyProgram: $studyProgram) {
    ...ReviewDataFields
  }
}
    ${ReviewDataFieldsFragmentDoc}`;

/**
 * __useGetReviewsQuery__
 *
 * To run a query within a React component, call `useGetReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReviewsQuery({
 *   variables: {
 *      courseNo: // value for 'courseNo'
 *      studyProgram: // value for 'studyProgram'
 *   },
 * });
 */
export function useGetReviewsQuery(baseOptions: Apollo.QueryHookOptions<GetReviewsQuery, GetReviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReviewsQuery, GetReviewsQueryVariables>(GetReviewsDocument, options);
      }
export function useGetReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReviewsQuery, GetReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReviewsQuery, GetReviewsQueryVariables>(GetReviewsDocument, options);
        }
export type GetReviewsQueryHookResult = ReturnType<typeof useGetReviewsQuery>;
export type GetReviewsLazyQueryHookResult = ReturnType<typeof useGetReviewsLazyQuery>;
export type GetReviewsQueryResult = Apollo.QueryResult<GetReviewsQuery, GetReviewsQueryVariables>;
export const RemoveReviewDocument = gql`
    mutation RemoveReview($reviewId: String!) {
  removeReview(reviewId: $reviewId) {
    ...ReviewDataFields
  }
}
    ${ReviewDataFieldsFragmentDoc}`;
export type RemoveReviewMutationFn = Apollo.MutationFunction<RemoveReviewMutation, RemoveReviewMutationVariables>;

/**
 * __useRemoveReviewMutation__
 *
 * To run a mutation, you first call `useRemoveReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeReviewMutation, { data, loading, error }] = useRemoveReviewMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *   },
 * });
 */
export function useRemoveReviewMutation(baseOptions?: Apollo.MutationHookOptions<RemoveReviewMutation, RemoveReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveReviewMutation, RemoveReviewMutationVariables>(RemoveReviewDocument, options);
      }
export type RemoveReviewMutationHookResult = ReturnType<typeof useRemoveReviewMutation>;
export type RemoveReviewMutationResult = Apollo.MutationResult<RemoveReviewMutation>;
export type RemoveReviewMutationOptions = Apollo.BaseMutationOptions<RemoveReviewMutation, RemoveReviewMutationVariables>;
export const SetReviewInteractionDocument = gql`
    mutation SetReviewInteraction($reviewId: String!, $interactionType: ReviewInteractionType!) {
  setReviewInteraction(reviewId: $reviewId, interactionType: $interactionType) {
    ...ReviewDataFields
  }
}
    ${ReviewDataFieldsFragmentDoc}`;
export type SetReviewInteractionMutationFn = Apollo.MutationFunction<SetReviewInteractionMutation, SetReviewInteractionMutationVariables>;

/**
 * __useSetReviewInteractionMutation__
 *
 * To run a mutation, you first call `useSetReviewInteractionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetReviewInteractionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setReviewInteractionMutation, { data, loading, error }] = useSetReviewInteractionMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *      interactionType: // value for 'interactionType'
 *   },
 * });
 */
export function useSetReviewInteractionMutation(baseOptions?: Apollo.MutationHookOptions<SetReviewInteractionMutation, SetReviewInteractionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetReviewInteractionMutation, SetReviewInteractionMutationVariables>(SetReviewInteractionDocument, options);
      }
export type SetReviewInteractionMutationHookResult = ReturnType<typeof useSetReviewInteractionMutation>;
export type SetReviewInteractionMutationResult = Apollo.MutationResult<SetReviewInteractionMutation>;
export type SetReviewInteractionMutationOptions = Apollo.BaseMutationOptions<SetReviewInteractionMutation, SetReviewInteractionMutationVariables>;
export const SetReviewStatusDocument = gql`
    mutation SetReviewStatus($reviewId: String!, $status: ReviewStatus!, $rejectionReason: String) {
  setReviewStatus(
    reviewId: $reviewId
    status: $status
    rejectionReason: $rejectionReason
  )
}
    `;
export type SetReviewStatusMutationFn = Apollo.MutationFunction<SetReviewStatusMutation, SetReviewStatusMutationVariables>;

/**
 * __useSetReviewStatusMutation__
 *
 * To run a mutation, you first call `useSetReviewStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetReviewStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setReviewStatusMutation, { data, loading, error }] = useSetReviewStatusMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *      status: // value for 'status'
 *      rejectionReason: // value for 'rejectionReason'
 *   },
 * });
 */
export function useSetReviewStatusMutation(baseOptions?: Apollo.MutationHookOptions<SetReviewStatusMutation, SetReviewStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetReviewStatusMutation, SetReviewStatusMutationVariables>(SetReviewStatusDocument, options);
      }
export type SetReviewStatusMutationHookResult = ReturnType<typeof useSetReviewStatusMutation>;
export type SetReviewStatusMutationResult = Apollo.MutationResult<SetReviewStatusMutation>;
export type SetReviewStatusMutationOptions = Apollo.BaseMutationOptions<SetReviewStatusMutation, SetReviewStatusMutationVariables>;
export const GetAllCourseNoDocument = gql`
    query GetAllCourseNo($filter: FilterInput!, $courseGroup: CourseGroupInput!) {
  search(filter: $filter, courseGroup: $courseGroup) {
    courseNo
  }
}
    `;

/**
 * __useGetAllCourseNoQuery__
 *
 * To run a query within a React component, call `useGetAllCourseNoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCourseNoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCourseNoQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      courseGroup: // value for 'courseGroup'
 *   },
 * });
 */
export function useGetAllCourseNoQuery(baseOptions: Apollo.QueryHookOptions<GetAllCourseNoQuery, GetAllCourseNoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllCourseNoQuery, GetAllCourseNoQueryVariables>(GetAllCourseNoDocument, options);
      }
export function useGetAllCourseNoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCourseNoQuery, GetAllCourseNoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllCourseNoQuery, GetAllCourseNoQueryVariables>(GetAllCourseNoDocument, options);
        }
export type GetAllCourseNoQueryHookResult = ReturnType<typeof useGetAllCourseNoQuery>;
export type GetAllCourseNoLazyQueryHookResult = ReturnType<typeof useGetAllCourseNoLazyQuery>;
export type GetAllCourseNoQueryResult = Apollo.QueryResult<GetAllCourseNoQuery, GetAllCourseNoQueryVariables>;
export const SearchCourseDocument = gql`
    query SearchCourse($filter: FilterInput!, $courseGroup: CourseGroupInput!) {
  search(filter: $filter, courseGroup: $courseGroup) {
    ...CourseDataFields
  }
}
    ${CourseDataFieldsFragmentDoc}`;

/**
 * __useSearchCourseQuery__
 *
 * To run a query within a React component, call `useSearchCourseQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCourseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCourseQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      courseGroup: // value for 'courseGroup'
 *   },
 * });
 */
export function useSearchCourseQuery(baseOptions: Apollo.QueryHookOptions<SearchCourseQuery, SearchCourseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchCourseQuery, SearchCourseQueryVariables>(SearchCourseDocument, options);
      }
export function useSearchCourseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCourseQuery, SearchCourseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchCourseQuery, SearchCourseQueryVariables>(SearchCourseDocument, options);
        }
export type SearchCourseQueryHookResult = ReturnType<typeof useSearchCourseQuery>;
export type SearchCourseLazyQueryHookResult = ReturnType<typeof useSearchCourseLazyQuery>;
export type SearchCourseQueryResult = Apollo.QueryResult<SearchCourseQuery, SearchCourseQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    _id
    name
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PushCourseCartDocument = gql`
    mutation PushCourseCart($items: [CourseCartItemInput!]!) {
  modifyCourseCart(newContent: $items) {
    courseNo
  }
}
    `;
export type PushCourseCartMutationFn = Apollo.MutationFunction<PushCourseCartMutation, PushCourseCartMutationVariables>;

/**
 * __usePushCourseCartMutation__
 *
 * To run a mutation, you first call `usePushCourseCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePushCourseCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pushCourseCartMutation, { data, loading, error }] = usePushCourseCartMutation({
 *   variables: {
 *      items: // value for 'items'
 *   },
 * });
 */
export function usePushCourseCartMutation(baseOptions?: Apollo.MutationHookOptions<PushCourseCartMutation, PushCourseCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PushCourseCartMutation, PushCourseCartMutationVariables>(PushCourseCartDocument, options);
      }
export type PushCourseCartMutationHookResult = ReturnType<typeof usePushCourseCartMutation>;
export type PushCourseCartMutationResult = Apollo.MutationResult<PushCourseCartMutation>;
export type PushCourseCartMutationOptions = Apollo.BaseMutationOptions<PushCourseCartMutation, PushCourseCartMutationVariables>;
export const GetCourseCartDocument = gql`
    query GetCourseCart {
  courseCart {
    studyProgram
    academicYear
    courseNo
    semester
    selectedSectionNo
    isHidden
    color
  }
}
    `;

/**
 * __useGetCourseCartQuery__
 *
 * To run a query within a React component, call `useGetCourseCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCourseCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCourseCartQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCourseCartQuery(baseOptions?: Apollo.QueryHookOptions<GetCourseCartQuery, GetCourseCartQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCourseCartQuery, GetCourseCartQueryVariables>(GetCourseCartDocument, options);
      }
export function useGetCourseCartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCourseCartQuery, GetCourseCartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCourseCartQuery, GetCourseCartQueryVariables>(GetCourseCartDocument, options);
        }
export type GetCourseCartQueryHookResult = ReturnType<typeof useGetCourseCartQuery>;
export type GetCourseCartLazyQueryHookResult = ReturnType<typeof useGetCourseCartLazyQuery>;
export type GetCourseCartQueryResult = Apollo.QueryResult<GetCourseCartQuery, GetCourseCartQueryVariables>;