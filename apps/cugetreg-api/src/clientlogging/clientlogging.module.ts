import { HttpModule } from '@nestjs/axios'
import { Module, forwardRef } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { ClientLoggingController } from './clientlogging.controller'
import { ClientLoggingService } from './clientlogging.service'

@Module({
  providers: [ClientLoggingService],
  controllers: [ClientLoggingController],
  imports: [HttpModule, forwardRef(() => AuthModule)],
  exports: [ClientLoggingService],
})
export class ClientLoggingModule {}
