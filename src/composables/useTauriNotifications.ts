import {
  active,
  cancel,
  cancelAll,
  channels,
  createChannel,
  Importance,
  isPermissionGranted,
  onAction,
  onNotificationReceived,
  pending,
  registerActionTypes,
  removeActive,
  removeAllActive,
  removeChannel,
  requestPermission,
  Schedule,
  ScheduleEvery,
  sendNotification,
  Visibility,
} from '@tauri-apps/plugin-notification'

const permissionGranted = ref(false)
export async function useTauriNotifications() {
  permissionGranted.value = await isPermissionGranted()
  if (!permissionGranted.value) {
    const permission = await requestPermission()
    permissionGranted.value = permission === 'granted'
  }
  await registerActionTypes([{
    id: 'tauri',
    actions: [{
      id: 'my-action',
      title: 'Settings',
    }],
  }])
  onNotificationReceived((notification) => {
    // eslint-disable-next-line no-console
    console.log(notification)
  })
  return {
    permissionGranted,
    Importance,
    Visibility,
    sendNotification,
    requestPermission,
    isPermissionGranted,
    registerActionTypes,
    pending,
    cancel,
    cancelAll,
    active,
    removeActive,
    removeAllActive,
    createChannel,
    removeChannel,
    channels,
    onNotificationReceived,
    onAction,
    Schedule,
    ScheduleEvery,
  }
}
