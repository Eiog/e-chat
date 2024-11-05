import { createRouter, eventHandler, readValidatedBody } from 'h3'
import { object, string } from 'zod'
import { isObjectId, paramsError } from '../helps'
import { FriendModel } from '../models'
import { $string2ObjectId } from './pipeline'

const router = createRouter()
router.post('/chat/create', eventHandler(async (event) => {
  const body = await readValidatedBody(event, object({
    _targetId: string({ required_error: '缺少id' }).refine(v => isObjectId(v)),
    type: string({ required_error: '缺少type' }),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }

  const _fromId = $string2ObjectId(event.context._id)

  const { _targetId, type } = body.data
  const result = await FriendModel.create({
    _fromId,
    _targetId,
    type,
  })
  return {
    success: true,
    message: '添加成功',
    result,
  }
}))
export default router
