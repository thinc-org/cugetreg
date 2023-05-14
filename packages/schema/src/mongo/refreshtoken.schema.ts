import { Document, Schema, Types } from 'mongoose'

export const RefreshTokenSchema = new Schema(
  {
    refreshToken: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
)

export interface RefreshToken {
  refreshToken: string
  userId: Types.ObjectId
  createdAt: Date
}

export type RefreshTokenDocument = Document<Types.ObjectId, unknown, RefreshToken> & RefreshToken
