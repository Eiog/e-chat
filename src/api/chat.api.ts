export interface CreateChat {
  Data: {
    _targetId: string
    type: 'message' | 'video' | 'audio'
  }
  Res: {
    success: boolean
    message: string
    list: any []
    count: number
  }
}
export const chatApi = {
  createChat(data: CreateChat['Data']) {
    return post<CreateChat['Res']>('/chat/create', data)
  },
}
