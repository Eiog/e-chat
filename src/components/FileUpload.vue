<script setup lang='ts'>
import { pictureDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'

const { type = 'image' } = defineProps<{
  type?: 'image' | 'file'
}>()
const icon = computed(() => {
  return type === 'image' ? 'i-mage-image' : 'i-mage-file'
})
async function onClick() {
  try {
    const picDir = await pictureDir()
    const filePath = await open({
      defaultPath: picDir,
    })
    if (!filePath)
      return
    const { file } = await useOpenFile(filePath)
    const { state: _ } = useQiniuUpload({ type: 'file', data: file })
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}
</script>

<template>
  <n-button quaternary size="small" circle @click="onClick">
    <template #icon>
      <i :class="icon" />
    </template>
  </n-button>
</template>

<style scoped lang='less'>

</style>
