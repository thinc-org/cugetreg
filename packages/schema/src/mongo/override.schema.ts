import { Document, Schema, Types } from 'mongoose'

import { GenEdType, genEdTypes } from './types'

export const OverrideSchema = new Schema({
  courseNo: { type: String, required: true },
  genEdType: {
    type: String,
    required: true,
    enum: genEdTypes,
  },
})

export interface Override {
  courseNo: string
  genEdType: GenEdType
}

export type OverrideDocument = Document<Types.ObjectId, unknown, Override> & Override
