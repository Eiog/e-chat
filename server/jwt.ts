import type { DecodeOptions, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'
import { createCipheriv, createDecipheriv } from 'node:crypto'
import process from 'node:process'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'

const jwtKey = process.env.PRIVATE_KEY ?? nanoid()
const cryptoKey = process.env.CRYPTO_KEY ?? nanoid(32)
const cryptoIv = process.env.CRYPTO_IV ?? nanoid(16)
const encrypt = false
export function aesEncrypt(data: string) {
  const cipher = createCipheriv('aes-256-cbc', cryptoKey, cryptoIv)
  return (cipher.update(data, 'utf8', 'hex') + cipher.final('hex'))
}
export function aesDecrypt(data: string) {
  const decipher = createDecipheriv('aes-256-cbc', cryptoKey, cryptoIv)
  return (decipher.update(data, 'hex', 'utf8') + decipher.final('utf8'))
}
export function sign<T extends object>(data: T, options?: SignOptions) {
  const jwtString = jwt.sign(data, jwtKey, {
    algorithm: 'HS256',
    expiresIn: '1d',
    ...options,
  })
  return encrypt ? aesEncrypt(jwtString) : jwtString
}

export function verify<T extends object>(token: string, options?: VerifyOptions): Promise<JwtPayload & T | undefined> {
  return new Promise((resolve, reject) => {
    jwt.verify(encrypt ? aesDecrypt(token) : token, jwtKey, { complete: false, ...options }, (err, jwtData) => {
      return err ? reject(err) : resolve(jwtData as any)
    })
  })
}
export function decode<T extends object>(token: string, options?: DecodeOptions): JwtPayload & T | null | undefined {
  return jwt.decode(encrypt ? aesDecrypt(token) : token, { ...options }) as any
}
