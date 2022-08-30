import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'

import { faker } from '@faker-js/faker'
import { SemesterEnum, StudyProgram } from '@thinc-org/chula-courses/dist/types'

import { Course } from '../common/types/course.type'
import { classTypes, dayOfWeeks, genEdTypes, studyPrograms } from '../mocks/common/enums'
import { CourseService } from './course.service'

const MockCourseModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  aggregate: jest.fn(),
  lean: jest.fn(),
}

const semesters = [SemesterEnum.First, SemesterEnum.Second, SemesterEnum.Third]

const createCourse = (): Course => {
  return {
    studyProgram: faker.helpers.arrayElement(studyPrograms),
    semester: faker.helpers.arrayElement(semesters),
    academicYear: '2565',
    courseNo: faker.datatype.number(10000).toString(),
    courseDescTh: faker.lorem.paragraph(),
    courseDescEn: faker.lorem.paragraph(),
    abbrName: faker.lorem.word(),
    courseNameTh: faker.lorem.word(),
    courseNameEn: faker.lorem.word(),
    faculty: faker.lorem.word(),
    department: faker.lorem.word(),
    credit: faker.datatype.number(4),
    creditHours: faker.datatype.number(4).toString(),
    courseCondition: faker.lorem.sentence(),
    genEdType: faker.helpers.arrayElement(genEdTypes),
    rating: faker.lorem.sentence(),
    midterm: {
      date: faker.date.future().toDateString(),
      period: {
        start: faker.date.future().toDateString(),
        end: faker.date.future().toDateString(),
      },
    },
    final: {
      date: faker.date.future().toDateString(),
      period: {
        start: faker.date.future().toDateString(),
        end: faker.date.future().toDateString(),
      },
    },
    sections: [
      {
        sectionNo: faker.datatype.number(10).toString(),
        closed: faker.datatype.boolean(),
        capacity: {
          current: faker.datatype.number(100),
          max: faker.datatype.number(100),
        },
        note: faker.lorem.sentence(0),
        classes: [
          {
            type: faker.helpers.arrayElement(classTypes),
            dayOfWeek: faker.helpers.arrayElement(dayOfWeeks),
            period: {
              start: faker.date.future().toDateString(),
              end: faker.date.future().toDateString(),
            },
            building: faker.lorem.word(),
            room: faker.lorem.word(),
            teachers: faker.helpers.arrayElements(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
          },
        ],
        genEdType: faker.helpers.arrayElement(genEdTypes),
      },
    ],
  }
}

const createCourseNos = () => {
  const courseNos = []
  for (let i = 0; i < 100; i++) {
    const course = createCourse()
    courseNos.push({
      _id: {
        courseNo: course.courseNo,
        studyProgram: course.studyProgram,
      },
    })
  }
  return courseNos
}

describe('CourseService', () => {
  let service: CourseService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getModelToken('course'),
          useValue: MockCourseModel,
        },
      ],
    }).compile()

    service = module.get<CourseService>(CourseService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findOne', () => {
    it('should return the course if no error', async () => {
      const course = createCourse()
      const want = course

      MockCourseModel.findOne.mockReturnThis()
      MockCourseModel.lean.mockResolvedValue(course)

      const actual = await service.findOne(
        course.courseNo,
        course.semester,
        course.academicYear,
        course.studyProgram
      )

      expect(MockCourseModel.findOne).toHaveBeenCalledTimes(1)
      expect(MockCourseModel.lean).toHaveBeenCalledTimes(1)
      expect(MockCourseModel.findOne).toHaveBeenCalledWith({
        courseNo: course.courseNo,
        semester: course.semester,
        academicYear: course.academicYear,
        studyProgram: course.studyProgram,
      })

      expect(actual).toStrictEqual(want)
    })

    it('should throw error if not found', async () => {
      const course = createCourse()

      MockCourseModel.findOne.mockReturnThis()
      MockCourseModel.lean.mockResolvedValue(undefined)

      expect(
        service.findOne(course.courseNo, course.semester, course.academicYear, course.studyProgram)
      ).rejects.toThrow(NotFoundException)

      expect(MockCourseModel.findOne).toHaveBeenCalledTimes(1)
      expect(MockCourseModel.lean).toHaveBeenCalledTimes(1)
      expect(MockCourseModel.findOne).toHaveBeenCalledWith({
        courseNo: course.courseNo,
        semester: course.semester,
        academicYear: course.academicYear,
        studyProgram: course.studyProgram,
      })
    })
  })

  describe('getAllCourseNos', () => {
    it('should return the courses if no error', async () => {
      const courseNos = createCourseNos()
      const want: Record<StudyProgram, string[]> = {
        S: [],
        T: [],
        I: [],
      }

      courseNos.forEach((course) => {
        want[course._id.studyProgram].push(course._id.courseNo)
      })

      MockCourseModel.aggregate.mockResolvedValue(courseNos)

      const actual = await service.getAllCourseNos()

      expect(MockCourseModel.aggregate).toHaveBeenCalledTimes(1)
      expect(MockCourseModel.aggregate).toHaveBeenCalledWith([
        {
          $group: {
            _id: { courseNo: '$courseNo', studyProgram: '$studyProgram' },
          },
        },
      ])

      expect(actual).toStrictEqual(want)
    })
    // it('should throw error if not found', async () => {})
  })

  describe('search', () => {
    // it('should return the course if no error', async () => {})
    // it('should throw error if not found', async () => {})
  })
})
