import { ConfigService } from '@nestjs/config'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'

import { Course, GenEdType, GenEdTypeEnum, StudyProgram } from '@thinc-org/chula-courses'

import { Override } from '@scraper/schema/override.schema'

import { OverrideService } from './override.service'

jest.mock('fs')

const MockConfigService = {
  get: jest.fn(),
}

const MockOverrideModel = {
  find: jest.fn(),
  lean: jest.fn(),
}

const MockReviewModel = {
  find: jest.fn(),
  lean: jest.fn(),
}

const createOverride = (
  courseNo: string,
  semester: string,
  academicYear: string,
  studyProgram: StudyProgram,
  genEd: { genEdType: GenEdType; sections: string[] }
): Override => {
  return {
    courseNo,
    semester,
    academicYear,
    studyProgram,
    genEd: genEd,
  }
}

describe('OverrideService', () => {
  let service: OverrideService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OverrideService,
        {
          provide: ConfigService,
          useValue: MockConfigService,
        },
        {
          provide: getModelToken('override'),
          useValue: MockOverrideModel,
        },
        {
          provide: getModelToken('review'),
          useValue: MockReviewModel,
        },
      ],
    }).compile()

    service = module.get<OverrideService>(OverrideService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('loadOverrides', () => {
    it('should load overrides successfully (simple)', async () => {
      const override1: Override = createOverride('1', '2', '2564', 'S', {
        genEdType: GenEdTypeEnum.HU,
        sections: ['1'],
      })
      const override2: Override = createOverride('2', '2', '2564', 'S', {
        genEdType: GenEdTypeEnum.NO,
        sections: ['1', '2', '3'],
      })
      const override3: Override = createOverride('3', '2', '2564', 'T', {
        genEdType: GenEdTypeEnum.SC,
        sections: ['1', '33'],
      })

      const overrideList = [override1, override2, override3]

      const want = {
        S: {
          '1': {
            '2564': {
              '2': override1,
            },
          },
          '2': {
            '2564': {
              '2': override2,
            },
          },
        },
        T: {
          '3': {
            '2564': {
              '2': override3,
            },
          },
        },
        I: {},
      }

      MockOverrideModel.find.mockReturnThis()
      MockOverrideModel.lean.mockReturnValue(overrideList)

      await service.loadOverrides()

      expect(MockOverrideModel.find).toHaveBeenCalledTimes(1)
      expect(MockOverrideModel.find).toHaveBeenCalledWith()
      expect(service.getOverrides()).toEqual(want)
    })

    it('should load overrides successfully (multiple semester)', async () => {
      const override1: Override = createOverride('1', '1', '2564', 'S', {
        genEdType: GenEdTypeEnum.HU,
        sections: ['1'],
      })
      const override2: Override = createOverride('2', '2', '2564', 'S', {
        genEdType: GenEdTypeEnum.NO,
        sections: ['1', '2', '3'],
      })
      const override3: Override = createOverride('3', '3', '2564', 'S', {
        genEdType: GenEdTypeEnum.SC,
        sections: ['1', '33'],
      })

      const overrideList = [override1, override2, override3]

      const want = {
        S: {
          '1': {
            '2564': {
              '1': override1,
            },
          },
          '2': {
            '2564': {
              '2': override2,
            },
          },
          '3': {
            '2564': {
              '3': override3,
            },
          },
        },
        T: {},
        I: {},
      }

      MockOverrideModel.find.mockReturnThis()
      MockOverrideModel.lean.mockReturnValue(overrideList)

      await service.loadOverrides()

      expect(MockOverrideModel.find).toHaveBeenCalledTimes(1)
      expect(MockOverrideModel.find).toHaveBeenCalledWith()
      expect(service.getOverrides()).toEqual(want)
    })

    it('should load overrides successfully (multiple academic year)', async () => {
      const override1: Override = createOverride('1', '2', '2563', 'S', {
        genEdType: GenEdTypeEnum.HU,
        sections: ['1'],
      })
      const override2: Override = createOverride('2', '2', '2564', 'S', {
        genEdType: GenEdTypeEnum.NO,
        sections: ['1', '2', '3'],
      })
      const override3: Override = createOverride('3', '2', '2565', 'S', {
        genEdType: GenEdTypeEnum.SC,
        sections: ['1', '33'],
      })

      const overrideList = [override1, override2, override3]

      const want = {
        S: {
          '1': {
            '2563': {
              '2': override1,
            },
          },
          '2': {
            '2564': {
              '2': override2,
            },
          },
          '3': {
            '2565': {
              '2': override3,
            },
          },
        },
        T: {},
        I: {},
      }

      MockOverrideModel.find.mockReturnThis()
      MockOverrideModel.lean.mockReturnValue(overrideList)

      await service.loadOverrides()

      expect(MockOverrideModel.find).toHaveBeenCalledTimes(1)
      expect(MockOverrideModel.find).toHaveBeenCalledWith()
      expect(service.getOverrides()).toEqual(want)
    })

    it('should load overrides successfully (multiple academic year and semester)', async () => {
      const override1: Override = createOverride('1', '1', '2563', 'S', {
        genEdType: GenEdTypeEnum.HU,
        sections: ['1'],
      })
      const override2: Override = createOverride('2', '2', '2564', 'S', {
        genEdType: GenEdTypeEnum.NO,
        sections: ['1', '2', '3'],
      })
      const override3: Override = createOverride('3', '3', '2565', 'S', {
        genEdType: GenEdTypeEnum.SC,
        sections: ['1', '33'],
      })

      const overrideList = [override1, override2, override3]

      const want = {
        S: {
          '1': {
            '2563': {
              '1': override1,
            },
          },
          '2': {
            '2564': {
              '2': override2,
            },
          },
          '3': {
            '2565': {
              '3': override3,
            },
          },
        },
        T: {},
        I: {},
      }

      MockOverrideModel.find.mockReturnThis()
      MockOverrideModel.lean.mockReturnValue(overrideList)

      await service.loadOverrides()

      expect(MockOverrideModel.find).toHaveBeenCalledTimes(1)
      expect(MockOverrideModel.find).toHaveBeenCalledWith()
      expect(service.getOverrides()).toEqual(want)
    })
  })

  describe('applyOverrides', () => {
    it('should apply override to GenEd properly', async () => {
      const course: Course = {
        courseNo: '0123101',
        abbrName: 'PARAGRAP WRITING',
        academicYear: '2564',
        courseCondition: '-',
        courseNameEn: 'PARAGRAPH WRITING',
        courseNameTh: 'การเขียนย่อหน้า',
        credit: 3,
        creditHours: 'LECT 1.0 CR + NL23 2.0 CR(LECT 1.0 HR + PRAC 4.0 HR)',
        department: 'สถาบันภาษาไทยสิรินธร',
        faculty: '01',
        genEdType: GenEdTypeEnum.NO,
        sections: [
          {
            capacity: {
              current: 22,
              max: 28,
            },
            classes: [{ teachers: ['A'], type: 'LECT' }],
            closed: false,
            genEdType: GenEdTypeEnum.NO,
            sectionNo: '1',
          },
        ],
        semester: '2',
        studyProgram: 'S',
      }

      const override = createOverride('0123101', '2', '2564', 'S', {
        genEdType: GenEdTypeEnum.HU,
        sections: ['1'],
      })

      const semester = {}
      semester[course.semester] = {
        genEd: override.genEd,
      }

      const academicYear = {}
      academicYear[course.academicYear] = semester

      const overrides = {
        S: {},
        I: {},
        T: {},
      } as Record<StudyProgram, Record<string, Record<string, Record<string, Override>>>>

      overrides[course.studyProgram][course.courseNo] = academicYear

      const want: Course = {
        courseNo: course.courseNo,
        abbrName: course.abbrName,
        academicYear: course.academicYear,
        courseCondition: course.courseCondition,
        courseNameEn: course.courseNameEn,
        courseNameTh: course.courseNameTh,
        credit: course.credit,
        creditHours: course.creditHours,
        department: course.department,
        faculty: course.faculty,
        genEdType: GenEdTypeEnum.HU,
        sections: [
          {
            capacity: {
              current: 22,
              max: 28,
            },
            classes: [{ teachers: ['A'], type: 'LECT' }],
            closed: false,
            genEdType: GenEdTypeEnum.HU,
            sectionNo: '1',
          },
        ],
        semester: course.semester,
        studyProgram: course.studyProgram,
        rating: undefined,
        courseDescEn: undefined,
        courseDescTh: undefined,
      }

      service.setOverrides(overrides)

      const actual = service.applyOverrides(course)

      expect(actual).toStrictEqual(want)
    })

    it("shouldn't apply override to Non-GenEd", async () => {
      const course: Course = {
        courseNo: '2022507',
        abbrName: 'DIG INNO STARTUPS',
        academicYear: '2564',
        courseCondition: 'C.F.',
        courseNameEn: 'DIGITAL INNOVATION STARTUPS',
        courseNameTh: 'สตาร์ตอัปนวัตกรรมดิจิทัล',
        credit: 3,
        creditHours: 'LECT 3.0 CR(LECT 3.0 HR)',
        department: 'สหสาขาวิชาธุรกิจเทคโนโลยีและการจัดการนวัตกรรม',
        faculty: '20',
        genEdType: GenEdTypeEnum.NO,
        sections: [
          {
            capacity: {
              current: 22,
              max: 28,
            },
            classes: [{ teachers: ['A'], type: 'LECT' }],
            closed: false,
            genEdType: GenEdTypeEnum.NO,
            sectionNo: '61',
          },
        ],
        semester: '2',
        studyProgram: 'S',
      }

      const override = createOverride('0123101', '2', '2564', 'S', {
        genEdType: GenEdTypeEnum.HU,
        sections: ['1'],
      })

      const semester = {}
      semester[course.semester] = {
        genEd: override.genEd,
      }

      const academicYear = {}
      academicYear[course.academicYear] = semester

      const overrides = {
        S: {},
        I: {},
        T: {},
      } as Record<StudyProgram, Record<string, Record<string, Record<string, Override>>>>

      overrides[course.studyProgram][course.courseNo] = semester

      service.setOverrides(overrides)

      const actual = service.applyOverrides(course)

      expect(actual).toStrictEqual(course)
    })

    it("shouldn't apply override to session that not in override session list", async () => {
      const course: Course = {
        courseNo: '0123101',
        abbrName: 'PARAGRAP WRITING',
        academicYear: '2564',
        courseCondition: '-',
        courseNameEn: 'PARAGRAPH WRITING',
        courseNameTh: 'การเขียนย่อหน้า',
        credit: 3,
        creditHours: 'LECT 1.0 CR + NL23 2.0 CR(LECT 1.0 HR + PRAC 4.0 HR)',
        department: 'สถาบันภาษาไทยสิรินธร',
        faculty: '01',
        genEdType: GenEdTypeEnum.NO,
        sections: [
          {
            capacity: {
              current: 22,
              max: 28,
            },
            classes: [{ teachers: ['A'], type: 'LECT' }],
            closed: false,
            genEdType: GenEdTypeEnum.NO,
            sectionNo: '2',
          },
        ],
        semester: '2',
        studyProgram: 'S',
      }

      const override = createOverride('0123101', '2', '2564', 'S', {
        genEdType: GenEdTypeEnum.HU,
        sections: ['1'],
      })

      const semester = {}
      semester[course.semester] = {
        genEd: override.genEd,
      }

      const academicYear = {}
      academicYear[course.academicYear] = semester

      const overrides = {
        S: {},
        I: {},
        T: {},
      } as Record<StudyProgram, Record<string, Record<string, Record<string, Override>>>>

      overrides[course.studyProgram][course.courseNo] = semester

      service.setOverrides(overrides)

      const actual = service.applyOverrides(course)

      expect(actual).toStrictEqual(course)
    })
  })
})
