<script setup lang='ts'>
import { debounce } from 'radash'

const props = withDefaults(defineProps<{
  value?: string
  autoTrigger?: boolean
  searchButton?: boolean
}>(), {
  autoTrigger: true,
})
const emit = defineEmits<{
  (e: 'update:value', v: typeof props.value): void
}>()
const _value = ref(props.value)
watch(() => props.value, (v) => {
  _value.value = v
})
const debounceEmit = debounce({ delay: 500 }, () => {
  emit('update:value', _value.value)
})
watch(_value, () => {
  debounceEmit()
})
function handleClick() {
  emit('update:value', _value.value)
}
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleClick()
  }
}
</script>

<template>
  <n-input-group>
    <n-input v-model:value="_value" placeholder="搜索" @keydown="handleKeyDown">
      <template #prefix>
        <i class="i-mage-search" />
      </template>
    </n-input>
    <n-button v-if="props.searchButton" @click="handleClick">
      <template #icon>
        <i class="i-mage-search" />
      </template>
    </n-button>
  </n-input-group>
</template>

<style scoped lang='less'>

</style>
