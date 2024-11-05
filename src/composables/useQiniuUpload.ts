/* eslint-disable no-console */
import type { FileData, Progress, UploadConfig } from 'qiniu-js'
import { isFunction } from 'mixte'
import { createDirectUploadTask, createMultipartUploadV2Task } from 'qiniu-js'

type State = 'pending' | 'uploading' | 'complete' | 'error'
type Options = {
  manual?: boolean
  multipart?: boolean
} & UploadConfig
interface Result {
  key: string
  hash: string
  fsize: number
  bucket: string
  name: string
}
type Context = any
export function useQiniuUpload(fileData: FileData, options?: Options) {
  const { manual, multipart, ..._options } = options ?? {}
  const state = ref<State>('pending')
  const progress = ref(0)
  const data = ref<Result>()
  const error = ref<Error>()
  const uploadConfig: UploadConfig = {
    tokenProvider: async () => {
      const { uploadToken } = await fsApi.uploadToken()
      return uploadToken
    },
    ..._options,
  }
  const uploadTask = multipart ? createMultipartUploadV2Task(fileData, uploadConfig) : createDirectUploadTask(fileData, uploadConfig)
  let _onProgress: ((progress: Partial<Progress>, context?: Context) => void) | null = null
  uploadTask.onProgress((_progress, context) => {
    console.log('_progress', _progress)
    state.value = 'uploading'
    progress.value = _progress.percent
    if (_onProgress && isFunction(_onProgress)) {
      _onProgress(_progress as any, context)
    }
  })
  let _onError: ((error?: Error, context?: Context) => void) | null = null
  uploadTask.onError((_error, context) => {
    console.warn('error', _error)
    error.value = _error
    state.value = 'error'
    progress.value = 0
    if (_onError && isFunction(_onError)) {
      _onError(_error, context)
    }
  })
  let _onComplete: ((result?: Result, context?: Context) => void) | null = null
  uploadTask.onComplete((result, context) => {
    const _result = result ? JSON.parse(result) : undefined
    console.log('result', _result)
    data.value = _result
    state.value = 'complete'
    progress.value = 1
    if (_onComplete && isFunction(_onComplete)) {
      _onComplete(_result, context)
    }
  })
  function start() {
    return uploadTask.start()
  }
  function cancel() {

  }
  if (!options?.manual) {
    start()
  }
  return {
    state,
    progress,
    start,
    cancel,
    onProgress(cb: (progress: Partial<Progress>, context?: Context) => void) {
      _onProgress = cb
    },
    onError(cb: (error?: Error, context?: Context) => void) {
      _onError = cb
    },
    onComplete(cb: (result?: Result, context?: Context) => void) {
      _onComplete = cb
    },
  }
}
