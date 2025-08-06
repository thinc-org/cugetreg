import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ClientLoggingSchema, ModelName } from '@cgr/schema'

import { AuthModule } from '../auth/auth.module'
import { ClientLoggingController } from './clientlogging.controller'
import { ClientLoggingService } from './clientlogging.service'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: ModelName.ClientLogging, schema: ClientLoggingSchema }]),
  ],
  providers: [ClientLoggingService],
  controllers: [ClientLoggingController],
  exports: [ClientLoggingService],
})
export class ClientLoggingModule {}
