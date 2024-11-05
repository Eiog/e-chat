/* eslint-disable no-console */

import type { MessageDispatchVector, MessageDispatchVectorCombination, MessagePayload, MessageType, OnlineMapValues, User } from '~server/chat'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import { router } from '~/modules'

const SOCKET_URL = import.meta.env.VITE_API_SOCKET_URL || ''
export interface Chat {
  chatId: string
  user: User
  createAt: string
  unread: number
  messageList: MessagePayload[]
}
export const useChatStore = defineStore(
  'chatStore',
  () => {
    const onlineUsers = ref<OnlineMapValues[]>()
    function checkOnline(id: string) {
      return onlineUsers.value?.some(s => s._id === id)
    }
    const { userInfo, token } = storeToRefs(useAppStore())
    const { status, connect, close, refresh, onMessage, send } = useWebSockets(SOCKET_URL, { manual: true })
    const online = computed(() => status.value === 'OPEN')
    watch(userInfo, (v) => {
      if (v) {
        connect([`_id-${v._id}`, `name-${v.nickname ?? v.account}`, `token-${token.value}`])
      }
      else {
        close()
      }
    }, { immediate: true })
    const activeChatId = ref<string>()
    const chatList = ref<Chat[]>([])
    const activeChat = computed(() => chatList.value.find(f => f.chatId === activeChatId.value))
    const messageList = computed(() => chatList.value.find(f => f.chatId === activeChatId.value)?.messageList)
    function setActiveId(id: string) {
      if (activeChatId.value === id)
        return
      activeChatId.value = undefined
      nextTick(() => {
        activeChatId.value = id
        const index = chatList.value.findIndex(f => f.chatId === id)
        if (index !== -1) {
          chatList.value[index].unread = 0
        }
      })
    }
    function createChat(user: User) {
      const chat = chatList.value.find(f => f.chatId === user._id)
      if (chat) {
        activeChatId.value = chat.chatId
      }
      else {
        const chat = {
          chatId: user._id,
          user,
          messageList: [],
          createAt: new Date().toISOString(),
          unread: 0,
        } as Chat
        chatList.value.push(chat)
        activeChatId.value = chat.chatId
      }
      router.push('/')
    }
    function removeChat(chatId: string) {
      const index = chatList.value.findIndex(f => f.chatId === chatId)
      if (index !== -1) {
        chatList.value.splice(index, 1)
        activeChatId.value = undefined
      }
    }
    function sendMessage(messageType: MessageType, content: string) {
      const user = activeChat.value?.user

      if (!userInfo.value || !activeChatId.value || !user)
        return
      const messagePayload: MessagePayload<'dispatch'> = {
        id: nanoid(),
        status: 'pending',
        user,
        messageType,
        type: 'dispatch',
        content,
        createAt: new Date(),
      }
      const data: MessageDispatchVector = {
        _fromId: userInfo.value._id,
        from: {
          _id: userInfo.value._id,
          name: userInfo.value.nickname,
          avatar: userInfo.value.avatar,
        },
        _targetId: activeChatId.value,
        target: messagePayload.user,
        method: 'message',
        messagePayload,
      }
      const index = chatList.value.findIndex(f => f.chatId === activeChatId.value)
      console.log(index)

      if (index !== -1) {
        chatList.value[index].messageList.push(data.messagePayload)
      }

      sendMethod(data)
    }
    function sendMethod(data: object) {
      send(JSON.stringify(data))
    }
    onMessage((message) => {
      const messageVector = JSON.parse(message.data.toString()) as MessageDispatchVectorCombination
      const { method } = messageVector
      switch (method) {
        case 'connect':
          {
            const { user } = messageVector as MessageDispatchVectorCombination<'connect'>
            window.$message.success(`${user.name}上线了！`)
          }
          break
        case 'close':
          break
        case 'error':
          break
        case 'message':
          {
            const { _fromId, from, messagePayload } = messageVector as MessageDispatchVectorCombination<'message'>
            const chat = chatList.value.find(f => f.chatId === _fromId)
            if (!chat) {
              const chat = {
                chatId: _fromId,
                user: from,
                messageList: [],
                createAt: new Date().toISOString(),
                unread: 0,
              } as Chat
              chatList.value.push(chat)
            }
            const index = chatList.value.findIndex(f => f.chatId === _fromId)
            if (index !== -1) {
              chatList.value[index].messageList.push(messagePayload)
              chatList.value[index].unread += 1
            }
            // window.$notification.create({
            //   title: messagePayload.user.name,
            //   avatar: () => h(NAvatar, {
            //     size: 'small',
            //     round: true,
            //     src: messagePayload.user.avatar,
            //   }),
            //   content: messagePayload.content,
            //   meta: messagePayload.createAt.toLocaleString(),
            //   duration: 1000 * 1.5,
            // })
            sendNotification(messagePayload)
          }
          break
        case 'message-status':
          {
            const { messageId, chatId, status } = messageVector as MessageDispatchVectorCombination<'message-status'>
            const chatIndex = chatList.value.findIndex(f => f.chatId === chatId)
            if (chatIndex !== -1) {
              const messageIndex = chatList.value[chatIndex].messageList.findIndex(f => f.id === messageId)
              if (messageIndex !== -1) {
                chatList.value[chatIndex].messageList[messageIndex].status = status
              }
            }
          }
          break
        case 'online-status':
          {
            const { onlineUsers: _onlineUsers } = messageVector as MessageDispatchVectorCombination<'online-status'>
            onlineUsers.value = _onlineUsers
          }
          break
        default:
          break
      }
    })
    async function sendNotification(messagePayload: MessagePayload<'dispatch'>) {
      const { sendNotification } = await useTauriNotifications()
      sendNotification({
        extra: {
          chatId: messagePayload.user._id,
          messageId: messagePayload.id,
        },
        title: messagePayload.user.name ?? '',
        body: messagePayload.content,

      })
    }
    function offline() {
      close()
    }
    return {
      onlineUsers,
      checkOnline,
      status,
      online,
      activeChatId,
      setActiveId,
      activeChat,
      chatList,
      messageList,
      createChat,
      removeChat,
      send,
      onMessage,
      sendMessage,
      connect,
      close,
      refresh,
      offline,
    }
  },
  {
    persist: {
      key: '__E_CHAT-CHAT_STORE_PERSIST__',
      pick: [],
    },
  },
)
