import { Test, TestingModule } from '@nestjs/testing'

import { CourseService } from './course.service'

describe('CourseService', () => {
  let service: CourseService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseService],
    }).compile()

    service = module.get<CourseService>(CourseService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
