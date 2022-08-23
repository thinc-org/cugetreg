import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserSchema } from '../schemas/user.schema'
import { UserResolver } from './user.resolver'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
  providers: [UserResolver],
})
export class UserModule {}
