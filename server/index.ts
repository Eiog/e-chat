/* eslint-disable no-console */

import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import process from 'node:process'
import { createApp, createError, defineEventHandler, serveStatic, toNodeListener, useBase } from 'h3'
import { join } from 'pathe'
import * as routers from './api'
import { getToken, isObjectId } from './helps'
import { verify } from './jwt'
import './chat'
import './db'

const PORT = Number(process.env.PORT) || 5632
const UPLOAD_DIR = 'upload'
const app = createApp({
  debug: true,
  onError: (error) => {
    console.error('Error:', error)
  },
  onRequest: async (event) => {
    console.log('Request:', event.path)
  },
})
app.use('/api/file', defineEventHandler(async (event) => {
  return serveStatic(event, {
    getContents: id => readFile(join(UPLOAD_DIR, id)),
    getMeta: async (id) => {
      const stats = await stat(join(UPLOAD_DIR, id)).catch(() => {})

      if (!stats || !stats.isFile()) {
        return
      }

      return {
        size: stats.size,
        mtime: stats.mtimeMs,
      }
    },
  })
}))
app.use(defineEventHandler(async (event) => {
  const excludePath = ['/api/login', '/api/fs/upload']
  try {
    if (!excludePath.includes(event.path)) {
      const token = getToken(event)
      const jwt = await verify(token)
      if (!jwt) {
        throw createError({
          status: 401,
          statusMessage: 'No Permission',
          message: 'Token无效',
        })
      }
      const _id = jwt._id
      if (!isObjectId(_id)) {
        throw createError({
          status: 401,
          statusMessage: 'No Permission',
          message: '_id验证错误',
        })
      }
      event.context._id = jwt._id
    }
  }
  catch {
    throw createError({
      status: 401,
      statusMessage: 'No Permission',
      message: 'Token无效',
    })
  }
}))
Object.values(routers).forEach((f) => {
  app.use(useBase('/api', f.handler))
})
const server = createServer(toNodeListener(app))
server.listen(PORT, () => {
  console.log(`server is running at http://127.0.0.1:${PORT}/`)
})
