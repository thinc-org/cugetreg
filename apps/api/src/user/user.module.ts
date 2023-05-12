import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserSchema } from '@cgr/schema'

import { UserResolver } from './user.resolver'
import { UserService } from './user.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
  providers: [UserResolver, UserService],
})
export class UserModule {}
