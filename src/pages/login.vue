<script setup lang='ts'>
defineOptions({

})
definePage({
  meta: {
    layout: 'blank',
    title: '登录',
    hideOnMenu: true,
  },
})
const { login } = useLogin()
const { formRef, formProps, formValue, validate } = useNaiveForm({
  value: {
    account: '123456',
    password: '',
  },
  rules: {
    account: {
      required: true,
      message: '请输入',
      trigger: ['input', 'blur'],
    },
    password: {
      required: true,
      message: '请输入',
      trigger: ['input', 'blur'],
    },
  },
})
const { loading, runAsync } = useRequest(() => login(formValue.value), { manual: true })

async function handleValidate() {
  try {
    await validate()
    const { message } = await runAsync()
    window.$message.success(message)
  }
  catch {

  }
}
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    handleValidate()
  }
}
</script>

<template>
  <div class="wh-full flex-col-center">
    <div class="window-bg h-[400px] w-[300px] flex-col">
      <AppBar :show-maximize-button="false" />
      <div class="flex-col-center p-[20px]">
        <div class="h-[120px] w-[120px] flex-col-center overflow-hidden rounded-full bg-white dark:bg-black/40">
          <SvgIcon name="boluo" :width="6" :height="6" />
        </div>
        <div class="m-t-[20px] flex-col">
          <n-form ref="formRef" v-bind="formProps" :show-label="false">
            <n-form-item path="account">
              <n-input v-model:value="formValue.account" placeholder="输入账号" @keydown="handleKeyDown" />
            </n-form-item>
            <n-form-item path="password">
              <n-input v-model:value="formValue.password" placeholder="输入密码" type="password" @keydown="handleKeyDown" />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" block :loading="loading" @click="handleValidate">
                登录
              </n-button>
            </n-form-item>
          </n-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.window-bg {
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.dark .window-bg {
  background-image: linear-gradient(135deg, #434343 0%, black 100%);
}
</style>
