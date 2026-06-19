import { genEdTypeMapper, reviewStatusMapper, semesterMapper } from './mapper';

type Review = {
  id: string;
  courseNo: string;
  courseAbbrName: string;
  genEdType: 'NO' | 'SC' | 'SO' | 'HU' | 'IN';
  studyProgram: 'T' | 'I' | 'S';
  academicYear: number;
  semester: 'FIRST' | 'SECOND' | 'SUMMER';
  rejectionReason: string | null;
  rating: number;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
};

export function convertReviewInfos(reviews: Review[]) {
  return reviews.map((review) => ({
    code: review.courseNo,
    name: review.courseAbbrName,
    tag: genEdTypeMapper(review.genEdType),
    status: reviewStatusMapper(review.status),
    rating: Number((review.rating / 2).toFixed(1)),
    term: `${review.academicYear.toString()} ${semesterMapper(review.semester)}`,
  }));
}
