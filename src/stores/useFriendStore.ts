import { defineStore } from 'pinia'

export const useFriendStore = defineStore(
  'friendStore',
  () => {
    const param = ref({
      page: 1,
      limit: 10,
      query: '',
    })
    const { data: rawUser, loading, refresh } = useRequest(() => userApi.friend(param.value))
    const friend = computed(() => rawUser.value?.list)
    const count = computed(() => rawUser.value?.count ?? 0)
    watch(param, () => {
      refresh()
    }, {
      deep: true,
    })
    const activeId = ref()
    const activeUser = computed(() => friend.value?.find(f => f._id === activeId.value))
    function setActiveId(id: string) {
      if (activeId.value === id)
        return
      activeId.value = undefined
      nextTick(() => {
        activeId.value = id
      })
    }
    return {
      param,
      rawUser,
      count,
      loading,
      refresh,
      friend,
      activeId,
      activeUser,
      setActiveId,
    }
  },
  {
    persist: {
      key: '__E_CHAT_FRIEND_STORE_PERSIST__',
      pick: [],
    },
  },
)
