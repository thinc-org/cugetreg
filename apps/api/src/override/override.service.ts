import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'

import { Override, Semester, StudyProgram } from '@cgr/schema'

import { OverrideInput } from '../graphql'

@Injectable()
export class OverrideService {
  constructor(
    @InjectModel('override')
    private overrideModel: Model<Override>
  ) {}

  async getOverrides(): Promise<Override[]> {
    const result = await this.overrideModel.find().lean()
    return result
  }

  async createOrUpdateOverride(override: OverrideInput): Promise<Override> {
    const result = await this.overrideModel
      .findOneAndUpdate(
        {
          courseNo: override.courseNo,
          studyProgram: override.studyProgram,
          academicYear: override.academicYear,
          semester: override.semester,
        },
        override,
        {
          new: true,
          upsert: true,
        }
      )
      .lean()
    return result
  }

  async deleteOverride(
    courseNo: string,
    studyProgram: StudyProgram,
    academicYear: string,
    semester: Semester
  ): Promise<Override> {
    const result = await this.overrideModel.findOneAndDelete({
      courseNo,
      studyProgram,
      academicYear,
      semester,
    })
    return result
  }
}
