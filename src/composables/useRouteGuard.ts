import type { Router } from 'vue-router/auto'

export function useRouteGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    next()
  })
  router.afterEach((to, from) => {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    to.meta.transition = toDepth < fromDepth ? 'slide-right' : toDepth > fromDepth ? 'slide-left' : 'fade'

    useChangeTitle(to)
  })
}
