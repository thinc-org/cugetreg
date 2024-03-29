import { Review } from '@cgr/codegen'
import { StudyProgram } from '@cgr/codegen'

export const mockReviews: Review[] = [
  {
    _id: '61ab376cea2d0aeded10dc2b',
    rating: 8,
    courseNo: '0201109',
    semester: '2',
    academicYear: '2564',
    studyProgram: StudyProgram.S,
    content: 'เหนื่อยากเลยค่าแงงงงง',
    likeCount: 0,
    dislikeCount: 0,
    myInteraction: null,
    status: 'APPROVED' as Review['status'],
    isOwner: false,
  },
  {
    _id: '61ab389bea2d0aeded10dc6a',
    rating: 9,
    courseNo: '0201109',
    semester: '1',
    academicYear: '2563',
    studyProgram: StudyProgram.S,
    content: 'อยากนอน',
    likeCount: 0,
    dislikeCount: 0,
    myInteraction: null,
    status: 'APPROVED' as Review['status'],
    isOwner: false,
  },
  {
    _id: '61ab39d457ff6cbfc0e4b809',
    rating: 7,
    courseNo: '0201109',
    semester: '3',
    academicYear: '2563',
    studyProgram: StudyProgram.S,
    content:
      'วิชานี้เกี่ยวกับแนวคิดและพัฒนาการของการบูรณาการยุโรป ตั้งแต่ช่วงสงครามโลกครั้งที่ 2 จนถึงปัจจุบัน ปัญหาความขัดแย้งต่างๆ ที่ส่งผลต่อการบูรณาการ ความร่วมมือ ผลกระทบและกลยุทธ์ด้านวัฒนธรรม การเมือง เศรษฐกิจ สังคม วิทยาศาสตร์และเทคโนโลยี ภายในกลุ่มสหภาพยุโรป และระหว่างสหภาพยุโรปกับไทย ประเทศในกลุ่มอาเซียนและเอเชีย \nสนุกดีนะ',
    likeCount: 0,
    dislikeCount: 0,
    myInteraction: null,
    status: 'APPROVED' as Review['status'],
    isOwner: false,
  },
  {
    _id: '61ab5096811ca6c9769f5bed',
    rating: 10,
    courseNo: '0201109',
    semester: '2',
    academicYear: '2564',
    studyProgram: StudyProgram.S,
    content: 'ดีครับ อาจารย์น่ารักมาก ๆ ',
    likeCount: 0,
    dislikeCount: 0,
    myInteraction: null,
    status: 'APPROVED' as Review['status'],
    isOwner: false,
  },
]

export const mockMyReviews: Review[] = [
  {
    _id: '61ab376cea2d0aeded10dc2b',
    rating: 8,
    courseNo: '0201109',
    semester: '2',
    academicYear: '2564',
    studyProgram: StudyProgram.S,
    content: 'เหนื่อยากเลยค่าแงงงงง',
    likeCount: 0,
    dislikeCount: 0,
    myInteraction: null,
    status: 'APPROVED' as Review['status'],
    isOwner: true,
  },
]

export const mockMyPendingReviews: Review[] = [
  {
    _id: '61ab59632d5b971a45ca3238',
    rating: 3,
    courseNo: '0201109',
    semester: '2',
    academicYear: '2564',
    studyProgram: StudyProgram.S,
    content: 'เขียนดี ๆ แล้ว อิอิ',
    likeCount: 1,
    dislikeCount: 0,
    myInteraction: 'L' as Review['myInteraction'],
    status: 'PENDING' as Review['status'],
    isOwner: true,
  },
]

export const mockMyRejectedReviews: Review[] = [
  {
    _id: '61ab59632d5b971a45ca3238',
    rating: 3,
    courseNo: '0201109',
    semester: '2',
    academicYear: '2564',
    studyProgram: StudyProgram.S,
    content: 'เขียนดี ๆ แล้ว อิอิ',
    likeCount: 1,
    dislikeCount: 0,
    myInteraction: 'L' as Review['myInteraction'],
    status: 'REJECTED' as Review['status'],
    rejectionReason: 'มีการพาดพิงถึงบุคคลที่ 42',
    isOwner: true,
  },
]
