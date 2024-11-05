/* eslint-disable no-console */

import type { IncomingMessage } from 'node:http'
import type { RawData, WebSocket } from 'ws'
import { nanoid } from 'nanoid'
import { WebSocketServer } from 'ws'

export interface User {
  _id: string
  name?: string
  avatar?: string
}
export interface OnlineMapValues {
  _id: string
  name?: string
  headers: IncomingMessage['headers']
}
export type MessageType = 'text' | 'video' | 'audio' | 'image'
export type MessageStatus = 'success' | 'error' | 'pending'
export type MessageMethod = 'connect' | 'close' | 'error' | 'message' | 'message-status' | 'online-status'
export type PayloadType = 'receive' | 'dispatch'
export interface MessagePayload<T extends PayloadType = PayloadType > {
  id: string
  status: MessageStatus
  messageType: MessageType
  content: string
  user: User
  type: T
  createAt: Date
}
export interface MessageReceiveVector {
  method: 'message'
  _fromId: string
  from: User
  _targetId: string
  target: User
  messagePayload: MessagePayload<'receive'>
}
export type MessageDispatchVector = Omit<MessageReceiveVector, 'messagePayload'> & {
  messagePayload: MessagePayload<'dispatch'>
}
export type MessageDispatchVectorCombination<T extends MessageMethod = MessageMethod> =
T extends 'connect' ? ConnectPayload & {
  method: T
} :
  T extends 'close' ? ClosePayload & {
    method: T
  } :
    T extends 'error' ? ErrorPayload & {
      method: T
    } :
      T extends 'message' ? MessageDispatchVector & {
        method: T
      } :
        T extends 'message-status' ? MessageStatusPayload & {
          method: T
        } :
          T extends 'online-status' ? OnlineStatusPayload & {
            method: T
          } :
      object
interface MessageStatusPayload {
  messageId: string
  status: MessageStatus
  chatId: string
}
interface OnlineStatusPayload {
  onlineUsers: OnlineMapValues[]
}
interface ConnectPayload {
  user: User
}
interface ClosePayload {

}
interface ErrorPayload {

}

const path = '/_chat'
const port = 5631
export const connections = new Map<WebSocket, OnlineMapValues>()
const waitPushMessage = new Map<string, MessageReceiveVector[]>()
export function getConnections() {
  return connections
}
export const wss: WebSocketServer = new WebSocketServer({ path, port }, () => {
  console.log(`socket is running at http://127.0.0.1:${port}${path}`)
})
wss.on('connection', onConnection)
wss.on('error', onError)

function getInstanceById(_id?: string) {
  const instance = Array.from(connections).find(([_, f]) => f._id === _id)
  return instance
    ? {
        socket: instance[0],
        values: instance[1],
      }
    : {}
}
function onConnection(socket: WebSocket, request: IncomingMessage) {
  const headers = request.headers
  const _id = headers['sec-websocket-protocol']?.split(',')[0].replace('_id-', '').replaceAll(' ', '')
  const name = headers['sec-websocket-protocol']?.split(',')[1].replace('name-', '').replaceAll(' ', '') ?? ''
  const token = headers['sec-websocket-protocol']?.split(',')[2].replace('token-', '').replaceAll(' ', '')
  if (!_id) {
    socket.close()
    return
  }
  if (!token) {
    socket.close()
    return
  }
  const { socket: expiredSocket } = getInstanceById(_id)
  expiredSocket && expiredSocket.close()
  connections.set(socket, { _id, name, headers })
  if (waitPushMessage.has(_id)) {
    waitPushMessage.get(_id)?.forEach((f) => {
      sendMessage(socket, f)
    })
    waitPushMessage.delete(_id)
  }
  const user = {
    _id,
    name,
  }
  sendConnect({ user })
  sendOnlineStatus({ onlineUsers: Array.from(connections.values()) })
  socket.on('close', () => {
    connections.delete(socket)
    sendOnlineStatus({ onlineUsers: Array.from(connections.values()) })
    sendClose({})
  })
  socket.on('message', onMessage)
}
function onMessage(this: WebSocket, data: RawData) {
  const messageReceiveVector = JSON.parse(data.toString()) as MessageReceiveVector
  const { method, _fromId, from, _targetId, target, messagePayload } = messageReceiveVector
  const { socket } = getInstanceById(_targetId)
  const messageDispatchVector: MessageReceiveVector = {
    method,
    _fromId,
    from,
    _targetId,
    target,
    messagePayload: {
      ...messagePayload,
      user: from,
      type: 'receive',
    },
  }
  if (!socket) {
    if (waitPushMessage.has(_targetId)) {
      waitPushMessage.get(_targetId)?.push(messageDispatchVector)
    }
    else {
      waitPushMessage.set(_targetId, [messageDispatchVector])
    }
    return
  }
  sendMessage(socket, messageDispatchVector).then(() => {
    sendMessageStatus(this, {
      messageId: messagePayload.id,
      chatId: _targetId,
      status: 'success',
    })
  }).catch(() => {
    sendMessageStatus(this, {
      messageId: messagePayload.id,
      chatId: _targetId,
      status: 'error',
    })
  })
}
function onError(err: Error) {
  console.error(err)
  sendError({})
}
function _send(socket: WebSocket, data: Record<string, any> & { method: MessageMethod }) {
  return new Promise<void>((resolve, reject) => {
    socket.send(JSON.stringify({
      ...data,
      extra: {
        _id: nanoid(),
        timestamp: Date.now(),
      },
    }), err => err ? reject(err) : resolve(undefined))
  })
}
export function _broadcast(data: Record<string, any> & { method: MessageMethod }) {
  return Promise.allSettled(Array.from(connections.entries()).map(([socket]) => {
    return _send(socket, data)
  }))
}
function sendMessage(socket: WebSocket, data: MessageReceiveVector) {
  return _send(socket, { ...data, method: 'message' })
}
function sendMessageStatus(socket: WebSocket, data: MessageStatusPayload) {
  return _send(socket, { ...data, method: 'message-status' })
}
function sendOnlineStatus(data: OnlineStatusPayload) {
  return _broadcast({ ...data, method: 'online-status' })
}
function sendConnect(data: ConnectPayload) {
  return _broadcast({ ...data, method: 'connect' })
}
function sendClose(data: ClosePayload) {
  return _broadcast({ ...data, method: 'close' })
}
function sendError(data: ErrorPayload) {
  return _broadcast({ ...data, method: 'error' })
}
