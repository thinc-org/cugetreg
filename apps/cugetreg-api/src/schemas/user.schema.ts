import { buildSchema, prop } from '@typegoose/typegoose'
import { IsString } from 'class-validator'
import * as mongoose from 'mongoose'

export class GoogleUserData {
  @prop({ required: true })
  googleId: string

  @prop()
  hasMigratedGDrive: boolean
}

export class CourseCartItem {
  @prop({ required: true })
  @IsString()
  studyProgram: string
  @prop({ required: true })
  @IsString()
  academicYear: string
  @prop({ required: true })
  @IsString()
  semester: string
  @prop({ required: true })
  @IsString()
  courseNo: string
  @prop({ required: true })
  @IsString()
  selectedSectionNo: string
  @prop({ required: true, default: false })
  @IsString()
  isHidden: boolean
  @prop()
  @IsString()
  color?: string
}

export class CourseCart {
  @prop({ type: () => [CourseCartItem], required: true })
  cartContent: CourseCartItem[]
}

export class User {
  @prop({ required: true })
  email: string
  @prop()
  name?: string
  @prop()
  google?: GoogleUserData
  @prop()
  courseCart?: CourseCart
  @prop()
  calendarId?: string
}

export type UserDocument = User & mongoose.Document

export const UserSchema = buildSchema(User)
