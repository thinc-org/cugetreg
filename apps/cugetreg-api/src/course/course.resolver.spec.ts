import { Test, TestingModule } from '@nestjs/testing'

import { CourseResolver } from './course.resolver'
import { CourseService } from './course.service'

describe('CourseResolver', () => {
  let resolver: CourseResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseResolver, CourseService],
    }).compile()

    resolver = module.get<CourseResolver>(CourseResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
