import { Store } from '@tauri-apps/plugin-store'

export async function useTauriStore(prefix?: string) {
  const { userInfo } = useAppStore()
  const id = userInfo?._id
  const store = await Store.load(`${prefix ?? id ?? 'base'}.store.bin`, {
    // we can save automatically after each store modification
    autoSave: 100,
  })
  return store
}
