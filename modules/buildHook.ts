import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options, nuxt) {
    const config = nuxt.options.runtimeConfig
    // nuxt.options.app.head.link = [
    //   ...(nuxt.options.app.head.link ?? []),
    //   {
    //     rel: "icon",
    //     type: "image/x-icon",
    //     href: `${config.app.baseURL}favicon.ico?v=${config.public.version}`,
    //   },
    // ];
  },
})
