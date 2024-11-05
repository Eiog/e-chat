<script setup lang='ts'>
const value = defineModel<string>('value')
const options = [
  {
    label: '黝',
    value: '#6b6882',
  },
  {
    label: '鹅黄',
    value: '#fff143',
  },
  {
    label: '松柏绿',
    value: '#21a675',
  },
  {
    label: '黯',
    value: '#41555d',
  },
  {
    label: '银红',
    value: '#f05654',
  },
  {
    label: '靛蓝',
    value: '#065279',
  },
  {
    label: '丁香色',
    value: '#cca4e3',
  },
]
function onClick(v: string) {
  value.value = v
}
</script>

<template>
  <div class="flex flex-wrap gap-[10px]">
    <div v-for="item in options" :key="item.value" class="h-[30px] w-[30px] flex-x-center p-[2px]">
      <div class="wh-full cursor-pointer rounded-full p-[3px] transition-base" :class="value === item.value ? 'shadow-md shadow-black/30 dark:shadow-white/30 ' : ''" @click="onClick(item.value)">
        <div :style="{ backgroundColor: `${item.value}` }" class="wh-full rounded-full" />
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
