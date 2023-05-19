import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { JwtAuthGuard } from '../auth/jwt.guard'
import { CurrentUser } from '../common/decorators/currentUser.decorator'
import {
  CourseCartItemInput,
  CourseCartItem as GraphQLCourseCartItem,
  User as GraphQLUser,
} from '../graphql'
import { UserService } from './user.service'

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() userId: string): Promise<GraphQLUser> {
    const user = await this.userService.getUserById(userId)
    return {
      _id: user._id.toString(),
      name: user.name,
    }
  }

  @Query('courseCart')
  @UseGuards(JwtAuthGuard)
  async getCurrentCartItems(@CurrentUser() userId: string): Promise<GraphQLCourseCartItem[]> {
    const user = await this.userService.getUserById(userId)
    return user.courseCart?.cartContent || []
  }

  @Mutation('modifyCourseCart')
  @UseGuards(JwtAuthGuard)
  async setCurrentCartItems(
    @CurrentUser() userId: string,
    @Args('newContent') newContent: CourseCartItemInput[]
  ): Promise<GraphQLCourseCartItem[]> {
    return this.userService.editCourseCart(userId, newContent)
  }
}
