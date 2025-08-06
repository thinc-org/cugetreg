import { Document, Schema, Types } from 'mongoose'

export const ClientLoggingSchema = new Schema(
  {
    short_message: { type: String, required: true },
    full_message: { type: String },
    kind: { type: String, required: true },
    app: { type: String, required: true, enum: ['frontend-client', 'backend'] },
    timestamp: { type: Date, required: true },
    host: { type: String, required: true },
  },
  {
    collection: 'clientLogging',
    timestamps: true,
  }
)

// Add TTL index to automatically remove logs older than 30 days
ClientLoggingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 })

export interface ClientLogging {
  short_message: string
  full_message?: string
  kind: string
  app: 'frontend-client' | 'backend'
  timestamp: Date
  host: string
}

export type ClientLoggingDocument = Document<Types.ObjectId, unknown, ClientLogging> & ClientLogging
