import type { DropdownOption } from 'naive-ui'

export function useContextMenu() {
  const x = ref(0)
  const y = ref(0)
  const show = ref(false)
  const optionsRef = ref<DropdownOption[]>([])
  function showContextMenu(e: MouseEvent, options?: DropdownOption[]) {
    if (options) {
      optionsRef.value = options
    }
    e.preventDefault()
    show.value = false
    nextTick().then(() => {
      x.value = e.clientX
      y.value = e.clientY
      show.value = true
    })
  }
  function hideContextMenu() {
    show.value = false
  }
  return {
    x,
    y,
    show,
    options: optionsRef,
    showContextMenu,
    hideContextMenu,
  }
}
