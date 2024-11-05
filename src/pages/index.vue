<!-- eslint-disable no-console -->
<script setup lang='ts'>
defineOptions({

})
definePage({
  meta: {
    layout: 'default',
    title: 'CHAT',
    requireAuth: true,
    keepAlive: true,
    icon: 'i-mage-message-conversation',
  },
})
</script>

<template>
  <MainLayout>
    <template #aside>
      <ChatList />
    </template>
    <ChatWindow />
  </MainLayout>
</template>

<style scoped lang='less'>

</style>
