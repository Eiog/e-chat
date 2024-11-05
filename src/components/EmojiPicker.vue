<script setup lang='ts'>
import data from '@emoji-mart/data'
import { Picker } from 'emoji-mart'

export interface EmojiResult {
  id: string
  name: string
  native: string
  unified: string
  keywords: string[]
  shortcodes: string
}
const emit = defineEmits<{
  (e: 'select', v: EmojiResult): void
}>()
const show = ref(false)
const emojiRef = ref<HTMLElement>()
onClickOutside(emojiRef, () => {
  show.value = false
})
const picker = ref<CustomElementConstructor>()
function init() {
  if (!picker.value) {
    picker.value = new Picker({
      parent: emojiRef.value,
      data,
      emojiButtonRadius: '6px',
      emojiButtonColors: [
        'rgba(155,223,88,.7)',
        'rgba(149,211,254,.7)',
        'rgba(247,233,34,.7)',
        'rgba(238,166,252,.7)',
        'rgba(255,213,143,.7)',
        'rgba(211,209,255,.7)',
      ],
      onEmojiSelect(v: EmojiResult) {
        emit('select', v)
      },
    }) as any
  }
}
onMounted(() => {
  if (emojiRef.value) {
    init()
  }
  else {
    const clearWatch = watch(emojiRef, (v) => {
      if (v) {
        init()
        clearWatch()
      }
    })
  }
})
</script>

<template>
  <n-popover trigger="manual" placement="top-start" display-directive="show" :show="show" class="rounded-md! p-[0]!" :show-arrow="false">
    <template #trigger>
      <n-button quaternary size="small" circle @click="show = !show">
        <template #icon>
          <i class="i-solar-smile-circle-outline" />
        </template>
      </n-button>
    </template>
    <div ref="emojiRef" />
  </n-popover>
</template>

<style scoped lang='less'>

</style>
