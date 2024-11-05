<script setup lang='ts'>
import type { UserFindDocument } from '~server/models'
import { deepClone } from 'mixte'
import type { UserUpdateType } from '~/api/user.api'

const props = defineProps<{
  data?: UserFindDocument
}>()
const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()
const { formRef, formProps, formValue, validate } = useNaiveForm<UserUpdateType['Data']>({
  value: props.data
    ? deepClone(props.data)
    : {
        account: '',
        nickname: '',
        password: '',
      },
  rules: {
    account: {
      required: false,
      message: '请输入',
      trigger: ['input', 'blur'],
    },
    nickname: {
      required: false,
      message: '请输入',
      trigger: ['input', 'blur'],
    },
    password: {
      required: false,
      message: '请输入',
      trigger: ['input', 'blur'],
    },
  },
})
const { runAsync, loading } = useRequest(() => userApi.update(formValue.value), { manual: true })
async function handleValidate() {
  try {
    await validate()
    const { message } = await runAsync()
    window.$message.success(message)
    emit('submit')
  }
  catch {

  }
}
</script>

<template>
  <n-form ref="formRef" v-bind="formProps">
    <n-form-item path="account" label="账号">
      <n-input v-model:value="formValue.account" placeholder="账号" />
    </n-form-item>
    <n-form-item path="nickname" label="昵称">
      <n-input v-model:value="formValue.nickname" placeholder="昵称" />
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-input v-model:value="formValue.password" placeholder="密码" type="password" />
    </n-form-item>
    <n-form-item>
      <div class="w-full flex gap-3">
        <n-button type="default" class="flex-1" block @click="emit('cancel')">
          取消
        </n-button>
        <n-button type="primary" class="flex-1" block :loading="loading" @click="handleValidate">
          确定
        </n-button>
      </div>
    </n-form-item>
  </n-form>
</template>

<style scoped lang='less'>

</style>
