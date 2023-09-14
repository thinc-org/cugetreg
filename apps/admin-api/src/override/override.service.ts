import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Model } from 'mongoose'

import { GenEdType, Override, OverrideDocument } from '@cgr/schema'

import { OverrideInput } from '../graphql'

@Injectable()
export class OverrideService {
  constructor(
    @InjectModel('override')
    private overrideModel: Model<OverrideDocument>
  ) {}

  async getOverrides(genEdType: GenEdType = null): Promise<Override[]> {
    const query = {}
    if (genEdType) query['genEdType'] = genEdType
    const result = await this.overrideModel.find(query)
    return result
  }

  async createOrUpdateOverride(override: OverrideInput): Promise<Override> {
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

  async deleteOverride(courseNo: string): Promise<Override> {
    const result = await this.overrideModel.findOneAndDelete({
      courseNo,
    })
    return result
  }
}
