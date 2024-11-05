/* eslint-disable no-console */
import { invoke } from '@tauri-apps/api/core'
import { BaseDirectory, exists, mkdir } from '@tauri-apps/plugin-fs'
import { router } from '~/modules'

const { getInfo } = useLogin()
export async function useInitialization() {
  try {
    const userDirExists = await exists('EChat', {
      baseDir: BaseDirectory.Document,
    })
    if (!userDirExists) {
      await mkdir('EChat', {
        baseDir: BaseDirectory.Document,
      })
    }
    const { token, userInfo } = storeToRefs(useAppStore())
    const { mainWindow, loginWindow } = await useWindows()
    const _id = await invoke<string>('get_variable', { key: '_id' })
    const _token = await invoke<string>('get_variable', { key: 'token' })
    await mainWindow?.listen<{ token: string, userInfo: typeof userInfo.value }>('on-login', ({ payload }) => {
      token.value = payload.token
      userInfo.value = payload.userInfo
    })
    await mainWindow?.listen('open-setting', () => {
      router.push('/setting')
    })
    if (_id && _token) {
      mainWindow?.setShadow(true)
      mainWindow?.show()
      loginWindow?.hide()
      token.value = _token
      await getInfo().catch(() => {
        loginWindow?.show()
        mainWindow?.close()
      })
    }
    else {
      loginWindow?.show()
      mainWindow?.close()
    }
  }
  catch (e) {
    console.log(e)
  }
}
