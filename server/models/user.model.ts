import { model, Schema } from 'mongoose'

export interface UserDocument {
  _id: string
  account: string
  nickname: string
  password: string
  avatar: string
  status: number
  realIp: string
  enable: boolean
  deleted: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  lastLoginAt: Date
}
export type UserFindDocument = UserDocument & {
  createdAt: string
  updatedAt: string
  deletedAt: string
  lastLoginAt: string
  added: boolean
}
export const UserModel = model<UserDocument>('User', new Schema(
  {
    account: { type: String, required: true },
    nickname: { type: String },
    password: { type: String, required: true },
    avatar: { type: String },
    status: { type: Number, default: 0 },
    realIp: { type: String },
    enable: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
  },
).index({ account: 1 }, { unique: true }))
