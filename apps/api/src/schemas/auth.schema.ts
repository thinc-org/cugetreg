import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Document, Types } from 'mongoose'

@Schema()
export class RefreshToken {
  @Prop({ index: true, required: true, unique: true })
  refreshToken: string

  @Prop({ required: true })
  userId: Types.ObjectId

  @Prop()
  createdAt: Date
}

export type RefreshTokenDocument = RefreshToken & Document

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
