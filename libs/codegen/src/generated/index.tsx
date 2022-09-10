import { gql } from '@apollo/client';
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
  studyProgram: Scalars['String'];
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
  date: Scalars['String'];
  period: Period;
};

/** Filters for searching courses. If a filter is not specified, it will not be used in the search. */
export type FilterInput = {
  /** List of `DayOfWeeks`. This filter is passed IF ANY of the course's sections have class in ANY of the `dayOfWeeks` in the list. */
  dayOfWeeks?: InputMaybe<Array<DayOfWeek>>;
  /** List of `GenEdTypes`. This filter is passed IF the course's `genEdType` matches ANY of the `genEdTypes` in the list. */
  genEdTypes?: InputMaybe<Array<GenEdType>>;
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

/** Overrides GenEdType for specific sections. Other sections without an override will have the value set as `NO` (Not GenEd) during scraping. */
export type GenEdOverride = {
  __typename?: 'GenEdOverride';
  genEdType: GenEdType;
  sections: Array<Scalars['String']>;
};

/** Overrides GenEdType for specific sections. Other sections without an override will have the value set as `NO` (Not GenEd) during scraping. */
export type GenEdOverrideInput = {
  genEdType: GenEdType;
  sections: Array<Scalars['String']>;
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
  /** @deprecated Will be redesigned. */
  modifyCalendarId?: Maybe<Scalars['String']>;
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
  courseGroup: CourseGroupInput;
  courseNo: Scalars['String'];
};


export type MutationEditMyReviewArgs = {
  review: EditReviewInput;
  reviewId: Scalars['String'];
};


export type MutationModifyCalendarIdArgs = {
  newCalendarId?: InputMaybe<Scalars['String']>;
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
  reviewId: Scalars['String'];
  status: ReviewStatus;
};

/** Course override for overriding course info from Reg Chula during course scraping. */
export type Override = {
  __typename?: 'Override';
  academicYear: Scalars['String'];
  courseNo: Scalars['String'];
  genEd?: Maybe<GenEdOverride>;
  semester: Scalars['String'];
  studyProgram: StudyProgram;
};

/** Course override for overriding course info from Reg Chula during course scraping. */
export type OverrideInput = {
  academicYear: Scalars['String'];
  courseNo: Scalars['String'];
  genEd?: InputMaybe<GenEdOverrideInput>;
  semester: Scalars['String'];
  studyProgram: StudyProgram;
};

/** Pair of start and end time. Format is `HH:MM`. */
export type Period = {
  __typename?: 'Period';
  end: Scalars['String'];
  start: Scalars['String'];
};

/** Filter for searching courses that have class inside the given time period. */
export type PeriodRangeInput = {
  end: Scalars['String'];
  start: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** @deprecated Will be redesigned. */
  calendarId?: Maybe<Scalars['String']>;
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


export type GetCourseInfoQuery = { __typename?: 'Query', course: { __typename?: 'Course', courseNo: string, abbrName: string, courseNameTh: string, courseNameEn: string, genEdType: GenEdType, sections: Array<{ __typename?: 'Section', classes: Array<{ __typename?: 'Class', dayOfWeek?: DayOfWeek | null }> }> } };

export type SearchQueryVariables = Exact<{
  filter: FilterInput;
  courseGroup: CourseGroupInput;
}>;


export type SearchQuery = { __typename?: 'Query', search: Array<{ __typename?: 'Course', courseNo: string }> };


export const GetCourseInfoDocument = gql`
    query GetCourseInfo($courseNo: String!, $courseGroup: CourseGroupInput!) {
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
export const SearchDocument = gql`
    query Search($filter: FilterInput!, $courseGroup: CourseGroupInput!) {
  search(filter: $filter, courseGroup: $courseGroup) {
    courseNo
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      courseGroup: // value for 'courseGroup'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;