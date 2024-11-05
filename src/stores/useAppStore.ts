import { defineStore } from 'pinia'
import { colorMode } from '~/composables/useColorMode'

export const useAppStore = defineStore(
  'appStore',
  () => {
    const isTauri = window.isTauri
    const { language, setLanguage } = useLanguage()
    const { value: collapsed, toggle: toggleCollapsed } = useBoolean(true)
    const { token, logged, refreshed, userInfo } = useLogin()
    const { x: contextMenuX, y: contextMenuY, show: contextMenuShow, options: contextMenuOptions, showContextMenu, hideContextMenu } = useContextMenu()

    return {
      isTauri,
      language,
      setLanguage,
      colorMode,
      collapsed,
      toggleCollapsed,
      token,
      logged,
      refreshed,
      userInfo,
      contextMenuX,
      contextMenuY,
      contextMenuShow,
      contextMenuOptions,
      showContextMenu,
      hideContextMenu,
    }
  },
  {
    persist: {
      key: '__E_CHAT-APP_STORE_PERSIST__',
      pick: [],
    },
  },
)
