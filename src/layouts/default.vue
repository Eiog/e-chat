<script setup lang="ts">
import type { DropdownOption, MenuGroupOption, MenuOption } from 'naive-ui'
import { NAvatar } from 'naive-ui'
import AvatarCropper from '~/components/AvatarCropper.vue'
import UserForm from '~/components/UserForm.vue'

const { t } = useI18n()
const { logout, getInfo } = useLogin()
const { collapsed, userInfo } = storeToRefs(useAppStore())
const { toggleCollapsed } = useAppStore()
const { menu, currentPath, changePath } = useRoutesMenu()
const { online } = storeToRefs(useChatStore())
const { offline, refresh } = useChatStore()
function renderLabel(option: MenuOption | MenuGroupOption) {
  return t(`GLOBAL.MENU.${option.label}`)
}
const { value: dropdownShow, setTrue: setDropdownShow, setFalse: setDropdownHide } = useBoolean(false)
const options: DropdownOption[] = [
  {
    key: 'info',
    type: 'render',
    render() {
      return h('div', { class: 'w-200px flex-y-center gap-3 p-3' }, [
        h('div', {
          class: 'cursor-pointer',
          onClick() {
            if (!userInfo.value)
              return
            const dialog = window.$dialog.create({
              title: '修改头像',
              style: 'width:auto',
              content() {
                if (!userInfo.value)
                  return
                return h(AvatarCropper, {
                  _id: userInfo.value._id,
                  src: userInfo.value.avatar,
                  onSaved() {
                    dialog.destroy()
                    getInfo()
                  },
                })
              },
            })
            setDropdownHide()
          },
        }, [
          h(NAvatar, { round: true, size: 60, src: userInfo.value?.avatar, objectFit: 'cover' }, {
            default: () => userInfo.value?.avatar ? null : h('i', { class: 'i-mage-user text-2xl' }),
          }),
        ]),
        h('div', { class: 'flex-col' }, [
          h('span', { class: 'text-md' }, { default: () => userInfo.value?.nickname ?? userInfo.value?.account }),
          h('span', { class: 'text-xs text-black/50 dark:text-white/20' }, { default: () => userInfo.value?.account }),
        ]),
      ])
    },
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    key: 'online',
    label: '在线',
    icon() {
      return h('i', { class: 'i-mage-check-circle-fill text-green-5' })
    },
    props: {
      onClick() {
        refresh()
        setDropdownHide()
      },
    },
  },
  {
    key: 'offline',
    label: '离线',
    icon() {
      return h('i', { class: 'i-mage-multiply-circle-fill text-red-5' })
    },
    props: {
      onClick() {
        offline()
        setDropdownHide()
      },
    },
  },
  {
    key: 'header-divider',
    type: 'divider',
  },
  {
    key: 'update',
    label: '修改资料',
    icon() {
      return h('i', { class: 'i-mage-edit' })
    },
    props: {
      onClick() {
        const dialog = window.$dialog.create({
          title: '修改资料',
          content() {
            return h(UserForm, {
              data: userInfo.value,
              onSubmit() {
                const { getInfo } = useLogin()
                getInfo()
                dialog.destroy()
              },
              onCancel() {
                dialog.destroy()
              },
            })
          },
        })
        setDropdownHide()
      },
    },
  },
  {
    key: 'logout',
    label: '退出登录',
    icon() {
      return h('i', { class: 'i-mage-logout' })
    },
    props: {
      onClick() {
        logout()
        setDropdownHide()
      },
    },
  },
]
</script>

<template>
  <div class="wh-full flex-col">
    <n-layout has-sider class="min-h-0 flex-1">
      <n-layout-sider
        :width="160"
        :collapsed-width="60"
        collapse-mode="width"
        :collapsed="collapsed"
        bordered
        content-class="flex flex-col"
      >
        <div class="w-full flex-1">
          <div class="h-[60px] w-full flex-y-center overflow-hidden p-x-[10px]">
            <n-dropdown :options="options" :show="dropdownShow" @clickoutside="setDropdownHide">
              <div class="flex-y-center gap-[5px]" @click="setDropdownShow">
                <n-badge dot :offset="[-5, 35]" :type="online ? 'success' : 'error'">
                  <NAvatar
                    class="transition-base!"
                    :class="online ? '' : 'grayscale'"
                    round
                    object-fit="cover"
                    :size="collapsed ? 36 : 44"
                    :src="userInfo?.avatar"
                  >
                    <i v-if="!userInfo?.avatar" class="i-mage-user" />
                  </NAvatar>
                </n-badge>
                <Transition name="fade" mode="out-in">
                  <p v-if="!collapsed" class="text-xl">
                    {{ userInfo?.nickname }}
                  </p>
                </Transition>
              </div>
            </n-dropdown>
          </div>
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="60"
            :collapsed-icon-size="24"
            :root-indent="20"
            :value="currentPath"
            :options="menu"
            :render-label="renderLabel"
            @update:value="changePath"
          />
        </div>
        <div class="flex items-center justify-center p-y-[10px]">
          <n-button quaternary @click="toggleCollapsed">
            <template #icon>
              <Transition name="fade" mode="out-in">
                <i v-if="collapsed" class="i-mage-dots-menu" />
                <i v-else class="i-mage-dash-menu" />
              </Transition>
            </template>
          </n-button>
        </div>
      </n-layout-sider>
      <n-layout-content>
        <main class="wh-full">
          <RouterEntry />
        </main>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<style scoped lang="less"></style>
