import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  // Default configuration options of the Nuxt module
  defaults: {},
  // Add types for volar
  setup(options, nuxt) {
    nuxt.options.build.transpile.push(
      'claygl',
      'echarts',
      'zrender',
      'resize-detector',
      /echarts/,
    )
  },
})
