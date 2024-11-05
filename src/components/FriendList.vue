<script setup lang='ts'>
import type { FriendFindDocument } from '~server/models'
import type { DropdownOption } from 'naive-ui'
import ApplyFriend from '~/components/ApplyFriend.vue'

const { param, loading, friend, activeId } = storeToRefs(useFriendStore())
const { setActiveId } = useFriendStore()
const { showContextMenu } = useAppStore()
const { createChat, checkOnline } = useChatStore()

function handleAddFriend() {
  window.$dialog.create({
    title: '添加好友',
    style: 'width:auto',
    content() {
      return h(ApplyFriend, {})
    },
  })
}
function handleDbClick({ _userId, nickname, account, avatar }: FriendFindDocument) {
  createChat({
    _id: _userId,
    name: nickname ?? account,
    avatar,
  })
}
function handleContextMenu(e: MouseEvent, _item: FriendFindDocument) {
  e.preventDefault()
  const options: DropdownOption[] = [
    {
      label: '修改备注',
      key: 'top',
      icon() {
        return h('i', { class: 'i-mage-edit' })
      },
    },
    {
      label: '删除好友',
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
    <div class="h-[60px] w-full flex-y-center gap-[5px]">
      <SearchInput v-model:value="param.query" />
      <n-button @click="handleAddFriend">
        <template #icon>
          <i class="i-mage-plus" />
        </template>
      </n-button>
    </div>
    <n-spin class="min-h-0 w-full flex-1" content-class="wh-full" :show="loading">
      <n-scrollbar v-if="friend && friend.length > 0" class="w-full">
        <div class="w-full flex-col gap-[5px]">
          <div
            v-for="item in friend"
            :key="item._id"
            class="w-full flex-y-center cursor-pointer gap-[10px] rounded-md p-[10px] transition-base hover:bg-black/5 dark:hover:bg-white/10"
            :class="activeId === item._id ? 'bg-black/5 dark:bg-white/10' : 'bg-transparent'"
            @click="setActiveId(item._id)"
            @dblclick="handleDbClick(item)"
            @contextmenu="($event) => handleContextMenu($event, item)"
          >
            <n-badge dot :offset="[-5, 35]" :type="checkOnline(item._userId) ? 'success' : 'error'">
              <n-avatar :src="item.avatar" size="large" round object-fit="cover">
                <i v-if="!item.avatar" class="i-mage-user" />
              </n-avatar>
            </n-badge>
            <div class="flex-col">
              <p class="text-md">
                {{ item.nickname ?? item.account }}
              </p>
              <p class="text-xs text-black/50 dark:text-white/20">
                {{ item.account }}
              </p>
            </div>
          </div>
        </div>
      </n-scrollbar>
      <div v-else class="wh-full flex items-center justify-center">
        <n-empty />
      </div>
    </n-spin>
  </div>
</template>

<style scoped lang='less'>

</style>
