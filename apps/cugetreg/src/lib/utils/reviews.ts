import { genEdTypeMapper } from '../mapper';
import { SEMESTER_LABEL_LONG } from '$lib/semesterOptions';
import type { 
  Semester,
  ReviewStatus,
  StudyProgram,
  GenEdType
} from '@cugetreg/zod-schemas';

type Review = {
  id: string;
  courseNo: string;
  courseAbbrName: string;
  genEdType: GenEdType;
  studyProgram: StudyProgram;
  academicYear: number;
  semester: Semester;
  rejectionReason: string | null;
  rating: number;
  content: string;
  status: ReviewStatus;
  createdAt: string;
};

export function convertReviewInfos(reviews: Review[]) {
  return reviews.map((review) => ({
    code: review.courseNo,
    name: review.courseAbbrName,
    tag: genEdTypeMapper(review.genEdType),
    status: review.status,
    rating: Number((review.rating / 2).toFixed(1)),
    term: `${review.academicYear.toString()} ${SEMESTER_LABEL_LONG[review.semester]}`,
  }));
}
