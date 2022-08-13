import { Test, TestingModule } from '@nestjs/testing'

import { ComputationResolver } from './computation.resolver'

describe('ComputationResolver', () => {
  let resolver: ComputationResolver

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComputationResolver],
    }).compile()

    resolver = module.get<ComputationResolver>(ComputationResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })
})
