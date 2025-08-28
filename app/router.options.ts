import type { RouterConfig } from '@nuxt/schema'

// https://router.vuejs.org/api/#routeroptions
// https://github.com/nuxt/framework/issues/1707#issuecomment-1104540588
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.query.isDialog === 'true') {
      return
    }

    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition)
        } else if (to.hash) {
          resolve({
            el: to.hash,
            behavior: 'smooth',
            top: 80,
          })
        } else {
          resolve({ behavior: 'auto', top: -1 })
        }
      }, 100)
    })
    return savedPosition || { behavior: 'auto', top: 0 }
  },
}
