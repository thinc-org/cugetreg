import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'

import { JwtAuthGuard } from '../auth/jwt.guard'
import { CurrentUser } from '../common/decorators/currentUser.decorator'
import { CourseCartItem, CourseCartItemInput, User } from '../graphql'
import { UserDocument } from '../schemas/user.schema'

@Resolver('User')
export class UserResolver {
  constructor(@InjectModel('user') private userModel: Model<UserDocument>) {}

  @Query('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() userId: string): Promise<User> {
    const user = await this.userModel.findById(userId)
    return {
      _id: user._id,
      name: user.name,
    }
  }

  @Query('courseCart')
  @UseGuards(JwtAuthGuard)
  async getCurrentCartItems(@CurrentUser() userId: string): Promise<CourseCartItem[]> {
    const user = await this.userModel.findById(userId)
    return user.courseCart?.cartContent || []
  }

  @Query('calendarId')
  @UseGuards(JwtAuthGuard)
  async getCalendarId(@CurrentUser() userId: string): Promise<string> {
    const user = await this.userModel.findById(userId)
    return user.calendarId
  }

  @Mutation('modifyCourseCart')
  @UseGuards(JwtAuthGuard)
  async setCurrentCartItems(
    @CurrentUser() userId: string,
    @Args('newContent') newContent: CourseCartItemInput[]
  ): Promise<CourseCartItem[]> {
    const user = await this.userModel.findById(userId)
    if (!user.courseCart) {
      user.courseCart = {
        cartContent: [],
      }
    }
    user.courseCart.cartContent = newContent
    await user.save()
    return user.courseCart.cartContent
  }

  @Mutation('modifyCalendarId')
  @UseGuards(JwtAuthGuard)
  async setCalendarId(
    @CurrentUser() userId: string,
    @Args('newCalendarId') newCalendarId: string
  ): Promise<string> {
    const user = await this.userModel.findById(userId)
    user.calendarId = newCalendarId
    await user.save()
    return user.calendarId
  }
}
