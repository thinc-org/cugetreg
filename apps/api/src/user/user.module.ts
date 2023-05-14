import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ModelName, UserSchema } from '@cgr/schema'

import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: ModelName.User, schema: UserSchema }])],
  providers: [UserResolver, UserService],
})
export class UserModule {}
