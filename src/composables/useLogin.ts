import type { UserFindDocument } from '~server/models/user.model'
import { invoke } from '@tauri-apps/api/core'
import { join } from '@tauri-apps/api/path'
import { BaseDirectory, exists, mkdir } from '@tauri-apps/plugin-fs'
import md5 from 'md5'

export interface LoginType {
  Data: {
    account: string
    password: string
  }
  Res: {
    success: boolean
    message: string
    token: string
    user: UserFindDocument
  }
}
export interface StatusType {
  Data: {
    token: string
  }
  Res: {
    success: boolean
    message: string
    token: string
    user: UserFindDocument
  }
}
export interface UserInfoType {
  Data: {
    token: string
  }
  Res: {
    success: boolean
    message: string
    user: UserFindDocument
  }
}
const token = ref<string | null>(null)
const logged = ref(false)
const refreshed = ref(false)
const userInfo = ref<UserFindDocument>()
function login({ account, password }: LoginType['Data']): Promise<LoginType['Res']> {
  return new Promise((resolve, reject) => {
    post<LoginType['Res']>('/login', { account, password: md5(password) }).then(async (result) => {
      const { loginWindow, createMainWindow } = await useWindows()
      const userDirPath = await join('EChat', account)
      const userDirExists = await exists(userDirPath, {
        baseDir: BaseDirectory.Document,
      })
      if (!userDirExists) {
        await mkdir(userDirPath, {
          baseDir: BaseDirectory.Document,
        })
      }
      await invoke('set_variable', { key: '_id', value: result.user._id })
      await invoke('set_variable', { key: 'token', value: result.token })
      await createMainWindow()
      await loginWindow?.emitTo('main', 'on-login', {
        token: result.token,
        userInfo: result.user,
      })
      await loginWindow?.hide()
      return resolve(result)
    }).catch(err => reject(err))
  })
}
async function refresh(data: { token: string }): Promise<StatusType['Res']> {
  return new Promise((resolve, reject) => {
    post<StatusType['Res']>('/refresh', { token: data.token }).then(async (result) => {
      userInfo.value = result.user
      logged.value = true
      refreshed.value = true
      const store = await useTauriStore()
      const { mainWindow, loginWindow } = await useWindows()
      await store.set('token', result.token)
      await store.save()
      await loginWindow?.show()
      await mainWindow?.hide()
      return resolve(result)
    }).catch(async (err) => {
      await logout()
      reject(err)
    })
  })
}
async function getInfo(): Promise<UserInfoType['Res']> {
  return new Promise((resolve, reject) => {
    post<UserInfoType['Res']>('/info').then(async (result) => {
      userInfo.value = result.user
      return resolve(result)
    }).catch((err) => {
      reject(err)
    })
  })
}
async function logout() {
  token.value = null
  logged.value = false
  refreshed.value = false
  userInfo.value = undefined
  const { mainWindow, loginWindow } = await useWindows()
  await invoke('remove_variable', { key: '_id' })
  await invoke('remove_variable', { key: 'token' })
  await loginWindow?.show()
  await mainWindow?.close()
}

export function useLogin() {
  return {
    token,
    logged,
    refreshed,
    userInfo,
    login,
    refresh,
    getInfo,
    logout,
  }
}
