import { basename, extname } from '@tauri-apps/api/path'
import { lstat, readFile } from '@tauri-apps/plugin-fs'
import mime from 'mime/lite'

export async function useOpenFile(path: string) {
  const fileName = await basename(path)
  const fileExt = await extname(path)
  const fileType = mime.getType(fileExt)
  const fileInfo = await lstat(path)
  const buffer = await readFile(path)
  const file = new File([buffer], fileName, {
    type: fileType ?? undefined,
  })

  return {
    fileName,
    fileExt,
    fileType,
    fileInfo,
    buffer,
    file,
  }
}
