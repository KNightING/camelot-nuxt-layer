import { defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  setup(options, nuxt) {
    const config = nuxt.options.runtimeConfig
    nuxt.options.app.head.link = [
      ...(nuxt.options.app.head.link ?? []),
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap',
      },
    ]
  },
})
