import { Schema, Types } from 'mongoose'

export interface RefreshToken {
  refreshToken: string
  userId: Types.ObjectId
  createdAt: Date
}

export const RefreshTokenSchema = new Schema(
  {
    refreshToken: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
)
