import type { EventHandlerRequest, H3Event } from 'h3'
import type { SafeParseReturnType } from 'zod'
import { createError, getHeader } from 'h3'
import { isObjectIdOrHexString } from 'mongoose'

export function paramsError(body: SafeParseReturnType<any, any>) {
  return createError({
    status: 400,
    statusMessage: 'Bad Request',
    message: '参数错误',
    data: body,
  })
}
export function getToken(event: H3Event<EventHandlerRequest>) {
  const token = getHeader(event, 'authorization')
  return token ? token.replace('Bearer ', '') : ''
}
export function isObjectId(id: string | string[]) {
  return Array.isArray(id) ? id.every(e => isObjectIdOrHexString(e)) : isObjectIdOrHexString(id)
}
