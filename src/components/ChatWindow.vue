<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { EmojiResult } from '~/components/EmojiPicker.vue'

const isTauri = window.isTauri

const { activeChat, status, messageList } = storeToRefs(useChatStore())
const { sendMessage } = useChatStore()
const inputValue = ref('')
const disabled = computed(() => inputValue.value.length <= 0 || status.value !== 'OPEN')
const validationStatus = ref<'error' | undefined>()
watch(inputValue, (v) => {
  if (v.length > 0) {
    if (validationStatus.value) {
      validationStatus.value = undefined
    }
  }
})
function handleSend() {
  sendMessage('text', inputValue.value)
  inputValue.value = ''
}
function onEmojiSelect(v: EmojiResult) {
  inputValue.value += v.native
}
function handleKeyDown(ev: KeyboardEvent) {
  if (ev.key === 'Enter' && !ev.shiftKey) {
    ev.preventDefault()
    if (disabled.value) {
      window.$message.error('请输入内容！')
      validationStatus.value = 'error'
      return
    }
    handleSend()
  }
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="activeChat" class="wh-full flex-col bg-white dark:bg-black">
      <div class="h-[60px] w-full flex">
        <div class="flex-y-center flex-1 p-[10px]">
          <div class="flex-col">
            <h2 class="text-lg">
              {{ activeChat.user.name }}
            </h2>
            <p class="text-xs text-black/50 dark:text-white/20">
              {{ activeChat.user.name }}
            </p>
          </div>
        </div>
        <div class="flex-col">
          <AppBar v-if="isTauri" />
        </div>
      </div>
      <div class="h-[1px] w-full bg-black/5 dark:bg-white/10" />
      <div class="min-h-0 w-full flex-1 p-[10px]">
        <n-scrollbar class="min-h-0 wh-full">
          <div class="flex-col gap-[20px]">
            <MessageCard
              v-for="item in messageList"
              :key="item.id"
              v-bind="item"
            />
          </div>
        </n-scrollbar>
      </div>
      <div class="h-[1px] w-full bg-black/5 dark:bg-white/10" />
      <div class="w-full flex-col gap-[5px] p-[10px] p-t-[5px]">
        <div class="h-[30px] w-full flex-y-center gap-[5px]">
          <EmojiPicker @select="onEmojiSelect" />
          <FileUpload />
          <FileUpload type="file" />
          <n-button quaternary size="small" circle>
            <template #icon>
              <i class="i-mage-phone" />
            </template>
          </n-button>
          <n-button quaternary size="small" circle>
            <template #icon>
              <i class="i-mage-video" />
            </template>
          </n-button>
        </div>
        <div class="relative h-[95px] w-full flex gap-[5px]">
          <n-form-item :show-label="false" :show-feedback="false" :validation-status="validationStatus" class="wh-full">
            <n-input
              v-model:value="inputValue"
              type="textarea"
              autosize
              class="wh-full"
              @keydown="handleKeyDown"
            />
          </n-form-item>
          <div class="absolute bottom-0 right-0 p-b-[3px] p-r-[3px]">
            <n-button type="primary" size="small" :disabled="disabled" @click="handleSend">
              发送
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
