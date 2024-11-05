import type { FriendFindDocument, UserFindDocument } from '~server/models'
import md5 from 'md5'

export interface UserFindType {
  Data: {
    page?: number
    limit?: number
    query?: string
  }
  Res: {
    success: boolean
    message: string
    list: UserFindDocument []
    count: number
  }
}
export interface UserInfoType {
  Data: {
    _id: string
  }
  Res: {
    success: boolean
    message: string
    user: UserFindDocument
  }
}
export interface UserUpdateType {
  Data: Partial<UserFindDocument>
  Res: {
    success: boolean
    message: string
    user: UserFindDocument
  }
}
export interface ApplyFriendType {
  Data: {
    _targetId: string
  }
  Res: {
    success: boolean
    message: string
  }
}
interface FriendType {
  Data: {
    page?: number
    limit?: number
    query?: string
  }
  Res: {
    success: boolean
    message: string
    list: FriendFindDocument[]
    count: number
  }
}
export const userApi = {
  find(data: UserFindType['Data']) {
    return post<UserFindType['Res']>('/user/find', data)
  },
  info(data: UserInfoType['Data']) {
    return get<UserInfoType['Res']>('/user/info', data)
  },
  update(data: UserUpdateType['Data']) {
    return post<UserUpdateType['Res']>('/user/update', { ...data, password: data.password ? md5(data.password) : undefined })
  },
  searchFriend(data: UserFindType['Data']) {
    return post<UserFindType['Res']>('/user/search-friend', data)
  },
  applyFriend(data: ApplyFriendType['Data']) {
    return post<ApplyFriendType['Res']>('/user/apply-friend', data)
  },
  friend(data: FriendType['Data']) {
    return post<FriendType['Res']>('/user/friend', data)
  },

}
