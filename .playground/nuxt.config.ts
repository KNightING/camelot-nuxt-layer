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

  // 區域語系範例：與 layer 繼承的 en / zh 基底合併，
  // 缺 key 時依 i18n/i18n.config.ts 的 fallback 鏈退回 zh-Hant / zh-Hans，最終落到 zh。
  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en-US',
        language: 'en-US',
        file: 'en-US.json',
      },
      // 區域語系需排在通用基底之前：瀏覽器語系（如 zh-TW）以語言前綴比對時取清單中第一個命中者
      {
        name: '正體中文（台灣）',
        code: 'zh-Hant-TW',
        language: 'zh-Hant-TW',
        file: 'zh-Hant-TW.json',
      },
      {
        name: '繁體中文（香港）',
        code: 'zh-Hant-HK',
        language: 'zh-Hant-HK',
        file: 'zh-Hant-HK.json',
      },
      {
        name: '繁體中文（澳門）',
        code: 'zh-Hant-MO',
        language: 'zh-Hant-MO',
        file: 'zh-Hant-MO.json',
      },
      {
        name: '正體中文',
        code: 'zh-Hant',
        language: 'zh-Hant',
        file: 'zh-Hant.json',
      },
      {
        name: '简体中文（中国大陆）',
        code: 'zh-Hans-CN',
        language: 'zh-Hans-CN',
        file: 'zh-Hans-CN.json',
      },
      {
        name: '简体中文（新加坡）',
        code: 'zh-Hans-SG',
        language: 'zh-Hans-SG',
        file: 'zh-Hans-SG.json',
      },
      {
        name: '简体中文（马来西亚）',
        code: 'zh-Hans-MY',
        language: 'zh-Hans-MY',
        file: 'zh-Hans-MY.json',
      },
      {
        name: '简体中文',
        code: 'zh-Hans',
        language: 'zh-Hans',
        file: 'zh-Hans.json',
      },
      // {
      //   name: '日本語',
      //   code: 'ja-JP',
      //   language: 'ja-JP',
      //   file: 'ja-JP.json',
      // },
      // {
      //   name: '한국어',
      //   code: 'ko-KR',
      //   language: 'ko-KR',
      //   file: 'ko-KR.json',
      // },
    ],
    defaultLocale: 'zh-Hant-TW',
    vueI18n: './i18n.config.ts',
  },
})
