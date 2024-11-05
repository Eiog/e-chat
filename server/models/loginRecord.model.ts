import { model, Schema } from 'mongoose'

export interface LoginRecordDocument {
  _id: Schema.Types.ObjectId
  _userId: Schema.Types.ObjectId
  ip: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export const LoginRecordModel = model<LoginRecordDocument>('login-record', new Schema(
  {
    _userId: { type: Schema.Types.ObjectId, required: true },
    ip: { type: String, required: true, default: null },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  },
))
