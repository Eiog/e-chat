<script setup lang='ts'>
const { contextMenuX, contextMenuY, contextMenuShow, contextMenuOptions } = storeToRefs(useAppStore())
const { hideContextMenu } = useAppStore()
</script>

<template>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="contextMenuX"
    :y="contextMenuY"
    :options="contextMenuOptions"
    :show="contextMenuShow"
    :on-clickoutside="hideContextMenu"
  />
</template>

<style scoped lang='less'>

</style>
