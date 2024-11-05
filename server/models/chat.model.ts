import { model, Schema } from 'mongoose'

export interface ChatDocument {
  _id: Schema.Types.ObjectId
  _fromId: Schema.Types.ObjectId
  _targetId: Schema.Types.ObjectId
  type: 'message' | 'video' | 'audio'
  status: number
  deleted: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}
export type UserFindDocument = ChatDocument & {
  createdAt: string
  updatedAt: string
  deletedAt: string
  lastLoginAt: string
  added: boolean
}
export const ChatModel = model<ChatDocument>('Chat', new Schema(
  {
    _fromId: { type: Schema.Types.ObjectId, required: true },
    _targetId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    status: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  },
))
