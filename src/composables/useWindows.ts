import { getAllWindows, getCurrentWindow } from '@tauri-apps/api/window'

export async function useWindows() {
  const allWindwos = await getAllWindows()
  const mainWindow = allWindwos.find(f => f.label === 'main')
  const loginWindow = allWindwos.find(f => f.label === 'login')
  function createMainWindow() {
    return useCreateWebViewWindow('main', {
      width: 1000,
      height: 600,
      center: true,
      resizable: true,
      maximizable: true,
      fullscreen: false,
      decorations: false,
      transparent: true,
      hiddenTitle: true,
      visible: true,
      shadow: false,
    })
  }
  return {
    mainWindow,
    loginWindow,
    getCurrentWindow,
    createMainWindow,
  }
}
