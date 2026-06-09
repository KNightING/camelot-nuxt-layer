import { fileURLToPath } from 'node:url'
import os from 'node:os'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

// Dev workaround (macOS): Nuxt 4 的 vite-node 會在 os.tmpdir() 底下建立 unix domain
// socket；macOS 預設 $TMPDIR 過長，使 socket 路徑超過 ~104 字元的 sun_path 上限 →
// `connect EINVAL`。將 TMPDIR 導向短路徑讓 socket 路徑合法。僅 playground 開發用，不隨 layer 發佈。
if (process.platform !== 'win32' && os.tmpdir().length > 24) {
  const shortTmp = join('/tmp', 'cml-nuxt-dev')
  mkdirSync(shortTmp, { recursive: true })
  process.env.TMPDIR = shortTmp
}

export default defineNuxtConfig({
  extends: ['..'],

  runtimeConfig: {
    tappay: {
      addScript: false,
    },
    googlePay: {
      addScript: false,
    },
    securityPlugin: {
      enabled: false,
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
