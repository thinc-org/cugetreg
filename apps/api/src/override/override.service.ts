import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'

import { Override, OverrideDocument } from '@cgr/schema'

import { OverrideInput } from '../graphql'

@Injectable()
export class OverrideService {
  constructor(
    @InjectModel('override')
    private overrideModel: Model<Override>
  ) {}

  async getOverrides(): Promise<OverrideDocument[]> {
    const result = await this.overrideModel.find()
    return result
  }

  async createOrUpdateOverride(override: OverrideInput): Promise<OverrideDocument> {
    const result = await this.overrideModel.findOneAndUpdate(
      {
        courseNo: override.courseNo,
      },
      override,
      {
        new: true,
        upsert: true,
      }
    )
    return result
  }

  async deleteOverride(courseNo: string): Promise<OverrideDocument> {
    const result = await this.overrideModel.findOneAndDelete({
      courseNo,
    })
    return result
  }
}
