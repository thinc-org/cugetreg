import { Module } from '@nestjs/common'

import { ComputationResolver } from './computation.resolver'

@Module({
  providers: [ComputationResolver],
})
export class ComputationModule {}
