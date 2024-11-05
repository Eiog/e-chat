<!-- eslint-disable no-console -->
<script setup lang='ts'>
const param = ref({
  page: 1,
  limit: 10,
  query: '',
})
const { data, loading, refresh } = useRequest(() => userApi.searchFriend(param.value), { manual: true })
watch(param, (v) => {
  if (v.query)
    refresh()
}, {
  deep: true,
})

async function handleAddFriend(id: string) {
  try {
    const { message } = await userApi.applyFriend({ _targetId: id })
    window.$message.success(message)
  }
  catch {

  }
}
</script>

<template>
  <div class="h-[400px] w-[500px] flex-col gap-[10px]">
    <SearchInput v-model:value="param.query" search-button />
    <div class="min-h-0 w-full flex-1">
      <n-spin class="wh-full" content-class="wh-full" :show="loading">
        <n-scrollbar v-if="data && data.list.length > 0" class="wh-full">
          <div class="wh-full flex-col gap-[5px]">
            <div
              v-for="item in data?.list"
              :key="item._id"
              class="w-full flex flex-y-center cursor-pointer gap-[5px] rounded-md p-[10px] transition-base hover:bg-black/5"
            >
              <n-avatar :src="item.avatar" size="large" object-fit="cover">
                <i v-if="!item.avatar" class="i-mage-user text-xl" />
              </n-avatar>
              <div class="min-w-0 flex-col flex-1">
                <p class="text-base">
                  {{ item.nickname ?? item.account }}
                </p>
                <p class="text-xs text-black/50 dark:text-white/20">
                  {{ item.account }}
                </p>
              </div>
              <div class="flex items-center justify-center">
                <n-button size="small" strong secondary :circle="!item.added" :disabled="item.added" @click="handleAddFriend(item._id)">
                  <template v-if="!item.added" #icon>
                    <i class="i-mage-plus" />
                  </template>
                  <span v-if="item.added">已添加</span>
                </n-button>
              </div>
            </div>
          </div>
        </n-scrollbar>
        <div v-else class="wh-full flex items-center justify-center">
          <n-empty />
        </div>
      </n-spin>
    </div>
    <div class="">
      <n-pagination v-model:page="param.page" v-model:page-size="param.limit" :item-count="data?.count">
        <template #prefix="{ itemCount }">
          {{ itemCount }} 项
        </template>
      </n-pagination>
    </div>
  </div>
</template>

<style scoped lang='less'>

</style>
