import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  hooks: {
    // "prepare:types": ({ tsConfig, references }) => {
    //   tsConfig.compilerOptions ||= {};
    //   tsConfig.compilerOptions.types ||= [];
    //   tsConfig.compilerOptions!.types.push("@types/tpdirect");
    //   references.push({
    //     types: "@types/tpdirect",
    //   });
    // },
  },
  setup(options, nuxt) {
    const config = nuxt.options.runtimeConfig
    const scripts = nuxt.options.app.head.script ?? []
    if (config.tappay.addScript) {
      scripts.push({
        src: 'https://js.tappaysdk.com/sdk/tpdirect/v5.17.0',
      })
    }

    if (config.googlePay.addScript) {
      scripts.push({
        src: 'https://pay.google.com/gp/p/js/pay.js',
      })
    }
    nuxt.options.app.head.script = scripts
  },
})
