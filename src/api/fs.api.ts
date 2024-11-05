export interface UploadFileType {
  Data: {
    file: File
  }
  Res: {
    success: boolean
    message: string
    resp: {
      status: number
      statusCode: number
      statusMessage: string
      headers: Headers
      size: number
      aborted: boolean
      rt: number
      keepAliveSocket: boolean
      requestUrls: string[]
      timing?: any
      remoteAddress: string
      remotePort: number
      socketHandledRequests: number
      socketHandledResponses: number
      data: {
        key: string
        hash: string
        fsize: number
        bucket: string
        name: string
      }
    }
    data: UploadFileType['Res']['resp']['data']
  }
}
export interface UploadTokenType {
  Res: {
    success: boolean
    message: string
    uploadToken: string
  }
}
export const fsApi = {
  upload(data: UploadFileType['Data']) {
    const formData = new FormData()
    formData.append('file', data.file)
    return post<UploadFileType['Res']>('/fs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  uploadToken() {
    return post<UploadTokenType['Res']>('/fs/upload-token')
  },
}
