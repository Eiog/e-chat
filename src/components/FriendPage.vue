<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { FriendFindDocument } from '~server/models'

const { activeUser } = storeToRefs(useFriendStore())

const isTauri = window.isTauri

const { createChat } = useChatStore()

function handleCreateChat({ _userId, nickname, account, avatar }: FriendFindDocument) {
  createChat({
    _id: _userId,
    name: nickname ?? account,
    avatar,
  })
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="activeUser" class="relative wh-full flex-col bg-cover bg-no-repeat" :style="{ backgroundImage: `url(${activeUser?.avatar})` }">
      <div class="wh-full flex-col bg-white/90 backdrop-blur-xl dark:bg-black/80">
        <AppBar v-if="isTauri" />
        <div class="min-h-0 w-full flex-col-center flex-1 gap-[20px]">
          <n-avatar :src="activeUser?.avatar" :size="120" round object-fit="cover">
            <i v-if="!activeUser?.avatar" class="i-mage-user text-5xl" />
          </n-avatar>
          <div class="flex-col-center">
            <p class="text-2xl">
              {{ activeUser?.nickname ?? activeUser?.account }}
            </p>
            <p class="text-black/50">
              {{ activeUser?.account }}
            </p>
          </div>
          <div class="flex gap-[20px]">
            <n-button type="primary" circle size="large" @click="handleCreateChat(activeUser)">
              <template #icon>
                <i class="i-mage-message" />
              </template>
            </n-button>
            <n-button type="success" circle size="large">
              <template #icon>
                <i class="i-mage-phone" />
              </template>
            </n-button>
            <n-button type="info" circle size="large">
              <template #icon>
                <i class="i-mage-video" />
              </template>
            </n-button>
            <n-button type="error" circle size="large">
              <template #icon>
                <i class="i-mage-trash" />
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="wh-full flex-col">
      <AppBar v-if="isTauri" />
      <div class="min-h-0 w-full flex-col-center flex-1">
        <n-empty />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang='less'>

</style>
