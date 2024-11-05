<!-- eslint-disable vue/prop-name-casing -->
<script setup lang='ts'>
import { pictureDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'
import Cropper from 'cropperjs'
import { nanoid } from 'nanoid'
import 'cropperjs/dist/cropper.min.css'

const { _id, src } = defineProps<{
  _id: string
  src?: string
}>()
const emit = defineEmits<{
  (e: 'saved'): void
}>()
const { value: cropperLoading, setTrue: setCropperLoading, setFalse: hideCropperLoading } = useBoolean(true)
const domRef = ref<HTMLElement>()
const imgRef = ref<HTMLImageElement>()
const cropperIns = shallowRef<Cropper>()
const previewUrl = ref<string>()
const previewFile = shallowRef<File>()
function init() {
  if (!imgRef.value)
    return
  cropperIns.value = new Cropper(imgRef.value, {
    viewMode: 3,
    dragMode: 'none',
    aspectRatio: 1,
    initialAspectRatio: 1,
    ready() {
      const data = {
        x: 0,
        y: 0,
        width: 300,
        height: 300,
      }
      const imageData = cropperIns.value?.getImageData()
      if (imageData) {
        const { naturalWidth, naturalHeight } = imageData
        const minNum = Math.min(naturalWidth, naturalHeight)
        data.width = minNum
        data.height = minNum
      }
      cropperIns.value?.setData(data)
      hideCropperLoading()
      handleCrop()
    },
  })
}
async function handleOpenLocale() {
  try {
    const picDir = await pictureDir()
    const filePath = await open({
      defaultPath: picDir,
    })
    if (!filePath)
      return
    setCropperLoading()
    const { file } = await useOpenFile(filePath)
    const url = URL.createObjectURL(file)
    if (cropperIns.value) {
      cropperIns.value.replace(url)
    }
  }
  catch {

  }
}
function handleReset() {
  if (!cropperIns.value)
    return
  cropperIns.value.reset()
}
function handleCrop() {
  if (!cropperIns.value)
    return
  cropperIns.value.getCroppedCanvas({
    width: 512,
    height: 512,
  }).toBlob((blob) => {
    if (blob) {
      previewFile.value = new File([blob], `avatar-${nanoid()}-${Date.now()}.png`, { type: 'image/png' })
      previewUrl.value = URL.createObjectURL(blob)
    }
  })
}
const { value: fetchLoading, setTrue: setFetchLoading, setFalse: hideFetchLoading } = useBoolean(false)
async function handleSave() {
  if (!previewFile.value)
    return
  try {
    setFetchLoading()
    const { data } = await fsApi.upload({ file: previewFile.value })
    const { message } = await userApi.update({ _id, avatar: data.key })
    window.$message.success(message)
    emit('saved')
    hideFetchLoading()
  }
  catch {

  }
}
onMounted(() => {
  init()
})
</script>

<template>
  <div class="flex-col gap-[10px]">
    <div class="h-[300px] flex gap-[10px]">
      <n-spin :show="cropperLoading">
        <div ref="domRef" class="h-[300px] w-[300px]">
          <img ref="imgRef" class="hidden" :src="src" alt="">
        </div>
      </n-spin>
      <div class="h-full w-[200px] flex-col-center gap-[20px]">
        <div class="h-[64px] w-[64px] flex-x-center overflow-hidden rounded-lg bg-black/5">
          <img :src="previewUrl" alt="">
        </div>
        <div class="h-[128px] w-[128px] flex-x-center overflow-hidden rounded-full bg-black/5">
          <img :src="previewUrl" alt="">
        </div>
      </div>
    </div>
    <div class="flex-x-center gap-[10px]">
      <n-button @click="handleOpenLocale">
        本地上传
      </n-button>
      <n-button @click="handleReset">
        重置
      </n-button>
      <n-button @click="handleCrop">
        裁剪
      </n-button>
      <n-button :loading="fetchLoading" @click="handleSave">
        保存
      </n-button>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
