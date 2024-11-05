<script setup lang='ts'>
import type { DropdownOption } from 'naive-ui'

import type { Chat } from '~/stores/useChatStore'

const { chatList, activeChatId } = storeToRefs(useChatStore())
const { setActiveId, checkOnline } = useChatStore()
const { showContextMenu } = useAppStore()

function handleContextMenu(e: MouseEvent, _item: Chat) {
  e.preventDefault()
  const options: DropdownOption[] = [
    {
      label: '置顶消息',
      key: 'top',
      icon() {
        return h('i', { class: 'i-mage-pin' })
      },
    },
    {
      label: '删除聊天',
      key: 'delete',
      icon() {
        return h('i', { class: 'i-mage-trash' })
      },
      props: {
        onClick() {

        },
      },
    },
  ]
  showContextMenu(e, options)
}
</script>

<template>
  <div class="wh-full flex-col p-x-[10px]">
    <div class="h-[60px] w-full flex-y-center">
      <SearchInput />
    </div>
    <n-scrollbar v-if="chatList && chatList.length > 0" class="min-h-0 w-full flex-1">
      <div class="w-full flex-col gap-[5px]">
        <div
          v-for="item in chatList"
          :key="item.chatId"
          class="w-full flex-y-center cursor-pointer gap-[10px] rounded-md p-[10px] transition-base hover:bg-black/5 dark:hover:bg-white/10"
          :class="activeChatId === item.chatId ? 'bg-black/5 dark:bg-white/10' : 'bg-transparent'"
          @click="setActiveId(item.chatId)"
          @contextmenu="($event) => handleContextMenu($event, item)"
        >
          <n-badge :value="item.unread" :max="99">
            <n-badge dot :offset="[-5, 35]" :type="checkOnline(item.chatId) ? 'success' : 'error'">
              <n-avatar :src="item.user.avatar" size="large" round object-fit="cover">
                <i v-if="!item.user.avatar" class="i-mage-user" />
              </n-avatar>
            </n-badge>
          </n-badge>

          <div class="flex-col select-none">
            <p class="text-md">
              {{ item.user.name }}
            </p>
            <p class="text-xs text-black/50 dark:text-white/20">
              {{ item.user.name }}
            </p>
          </div>
        </div>
      </div>
    </n-scrollbar>
    <div v-else class="wh-full flex items-center justify-center">
      <n-empty />
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
