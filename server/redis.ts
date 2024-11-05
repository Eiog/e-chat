/* eslint-disable no-console */
import { createClient } from 'redis'

export const client = createClient()

client.on('error', err => console.log('Redis Client Error', err))

client.connect().then((res) => {
  console.log(res)
}).catch((err) => {
  console.log(err)
})
