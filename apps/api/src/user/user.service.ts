import { Resolver } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'

import { Semester, User } from '@cgr/schema'

import { CourseCartItem, CourseCartItemInput } from '../graphql'

@Resolver('User')
export class UserService {
  constructor(@InjectModel('user') private userModel: Model<User>) {}

  async getUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).lean()
  }

  async editCourseCart(
    userId: string,
    newContent: CourseCartItemInput[]
  ): Promise<CourseCartItem[]> {
    const user = await this.userModel.findById(userId)
    if (!user.courseCart) {
      user.courseCart = {
        cartContent: [],
      }
    }
    user.courseCart.cartContent = newContent.map((item) => {
      return {
        studyProgram: item.studyProgram,
        academicYear: item.academicYear,
        courseNo: item.courseNo,
        semester: item.semester as Semester,
        isHidden: item.isHidden,
        selectedSectionNo: item.selectedSectionNo,
        color: item.color,
      }
    })
    await user.save()
    return user.courseCart.cartContent
  }
}
