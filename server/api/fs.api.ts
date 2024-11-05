import dayjs from 'dayjs'
import { createError, createRouter, eventHandler, readFormData } from 'h3'
import { formUploader, getUploadToken, putExtra } from '../qiniu'

const router = createRouter()
router.post('/fs/upload', eventHandler(async (event) => {
  const formData = await readFormData(event)
  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    throw createError({
      status: 400,
      statusMessage: 'file not found',
      message: '文件不存在',
    })
  }
  const buffer = new Uint8Array(await file.arrayBuffer())
  const uploadToken = getUploadToken()
  const fileName = `${dayjs().format('YYYY-MM-DD')}/${file.name}`
  const { data, resp } = await formUploader.put(uploadToken, fileName, buffer, putExtra)

  if (resp?.statusCode !== 200) {
    throw createError({
      status: 400,
      statusMessage: 'upload error',
      message: '上传失败',
      data: resp,
    })
  }
  return {
    success: true,
    message: '上传成功',
    data,
    resp,
  }
}))
router.post('/fs/upload-token', eventHandler(async () => {
  const uploadToken = getUploadToken()
  return {
    success: true,
    message: '获取成功',
    uploadToken,
  }
}))
export default router
