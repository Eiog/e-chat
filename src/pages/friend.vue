<script setup lang='ts'>
defineOptions({

})
definePage({
  meta: {
    layout: 'default',
    title: 'FRIEND',
    requireAuth: true,
    keepAlive: true,
    icon: 'i-mage-checklist-note',
  },
})
</script>

<template>
  <MainLayout>
    <template #aside>
      <FriendList />
    </template>
    <FriendPage />
  </MainLayout>
</template>

<style scoped lang='less'>

</style>
