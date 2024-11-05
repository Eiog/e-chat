<script setup lang='ts'>

</script>

<template>
  <div class="wh-full flex">
    <div class="h-full w-[240px] flex-col">
      <slot name="aside" />
    </div>
    <div class="h-full w-[1px] bg-black/5" />
    <div class="h-full min-w-0 flex-1 bg-white dark:bg-black">
      <slot />
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
