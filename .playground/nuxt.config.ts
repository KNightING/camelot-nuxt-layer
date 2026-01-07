import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  extends: ['..'],

  runtimeConfig: {
    tappay: {
      addScript: false,
    },
    googlePay: {
      addScript: false,
    },
  },

  compatibilityDate: '2024-11-16',

  eslint: {
    config: {
      // Use the generated ESLint config for lint root project as well
      rootDir: fileURLToPath(new URL('..', import.meta.url)),
    },
  },
})
