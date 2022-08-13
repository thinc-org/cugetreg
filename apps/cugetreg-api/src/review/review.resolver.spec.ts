import { Test, TestingModule } from '@nestjs/testing'

import { ReviewResolver } from './review.resolver'
import { ReviewService } from './review.service'

describe('ReviewResolver', () => {
  let resolver: ReviewResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewResolver, ReviewService],
    }).compile()

    resolver = module.get<ReviewResolver>(ReviewResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
