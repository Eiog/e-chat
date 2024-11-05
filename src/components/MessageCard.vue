<script setup lang='ts'>
import type { MessagePayload } from '~server/chat'

const { type = 'receive', messageType = 'text', user, content, createAt, status = 'pending' } = defineProps<MessagePayload>()
const emit = defineEmits<{
  (e: 'refresh'): void
}>()
const isRight = computed(() => type === 'dispatch')
const { data, loading, run } = useRequest(() => userApi.info({ _id: user?._id }), { manual: true })
function onUpdateShow(v: boolean) {
  if (v) {
    if (data.value)
      return

    run()
  }
}
</script>

<template>
  <div class="flex gap-[15px]" :class="isRight ? 'flex-row-reverse' : ''">
    <div class="flex-col">
      <n-popover trigger="hover" :placement="isRight ? 'top-end' : 'top-start'" @update:show="onUpdateShow">
        <template #trigger>
          <n-avatar round :size="40" :src="user.avatar" />
        </template>
        <n-spin :show="loading">
          <div class="min-h-[100px] w-[120px] flex-col">
            1
          </div>
        </n-spin>
      </n-popover>
      <div class="flex items-center justify-center">
        <span class="text-black dark:text-zinc-5">{{ user.name }}</span>
      </div>
    </div>
    <div class="flex-col gap-[5px]" :class="isRight ? 'items-end' : 'items-start'">
      <div class="relative flex-col">
        <div class="absolute top-0 z-0 h-full flex-col" :class="isRight ? 'right-[-5px]' : 'left-[-5px]'">
          <div class="m-t-[20px] h-[10px] w-[10px] rotate-45 border" :class="isRight ? 'bg-green-4 border-green-5/50 dark:bg-green-9 dark:border-green-8/50' : 'bg-light-1 dark:border-dark-4 dark:bg-dark-5'" />
        </div>
        <div class="relative z-1 flex-col gap-[5px] border rounded-lg p-[10px]" :class="isRight ? 'bg-green-4 border-green-5/50 dark:bg-green-9 dark:border-green-8/50 ' : 'bg-light-1 dark:border-dark-4 dark:bg-dark-5'">
          <div class="text-base">
            <slot>
              <template v-if="messageType === 'text'">
                <pre>{{ content }}</pre>
              </template>
              <template v-if="messageType === 'image'">
                <n-image
                  object-fit="cover"
                  :src="content"
                />
              </template>
              <template v-if="messageType === 'audio'">
                <audio :src="content" controller />
              </template>
              <template v-if="messageType === 'video'">
                <video :src="content" controller />
              </template>
            </slot>
          </div>
        </div>
        <div v-if="isRight && status !== 'success'" class="t-0 absolute left-[-30px] h-full flex-y-center">
          <div class="flex cursor-pointer items-center justify-center p-[5px]" @click="emit('refresh')">
            <i
              class="i-mage-reload text-black/50 dark:text-white/50"
              :class="[status === 'pending' ? 'animate-inherit animated animate-roll-in' : '', status === 'error' ? 'text-red-5!' : '']"
            />
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <span class="text-xs text-zinc-3 dark:text-zinc-6">
          <slot name="time">
            {{ createAt.toLocaleString() }}
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
