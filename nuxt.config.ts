import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import {
  VueUseComponentsResolver,
} from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import tailwindcss from '@tailwindcss/vite'

const osPlatform = process.platform
let isWindows = false
let isMac = false
let isLinux = false

if (osPlatform === 'darwin') {
  isMac = true
}
else if (osPlatform === 'win32') {
  isWindows = true
}
else if (osPlatform === 'linux') {
  isLinux = true
}

function getArgvBoolean(key: string, defaultValue = false): boolean {
  const index = process.argv.findIndex((value) => {
    return value.startsWith(key)
  })

  if (index >= 0) {
    const arg = process.argv[index]
    if (!arg) return defaultValue

    const [key, value] = arg.split('=')
    if (value === 'true' || value === '1') {
      return true
    }
    else {
      return false
    }
  }
  return defaultValue
}

const dropCode = getArgvBoolean('--drop-code')

const currentDir = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    'unplugin-icons/nuxt',
    '@nuxt/eslint',
  ],

  $meta: {
    name: 'camelot',
  },

  imports: {
    dirs: [
      // scan all modules within given directory
      join(currentDir, '/app/composables/**'),
      join(currentDir, '/app/stores/**'),
      join(currentDir, '/app/shared/**'),
      join(currentDir, '/app/**'),
      '/app/**',
    ],
  },

  devtools: { enabled: false },

  app: {
    baseURL: '/',

    head: {
      meta: [
        {
          name: 'viewport',
          content: 'initial-scale=1, viewport-fit=cover',
        },
      ],
    },
  },

  css: [
    join(currentDir, '/app/assets/css/tailwind.css'),
  ],

  runtimeConfig: {
    tappay: {
      addScript: false,
    },
    googlePay: {
      addScript: false,
    },

    securityPlugin: {
      enabled: true,
      useNonce: true,
      contentSecurityPolicy: {
        connect: [],
        font: [],
        frame: [],
        img: [],
        manifest: [],
        media: [],
        object: [],
        script: [],
        style: [],
        worker: [],
        frameAncestors: [],
      },
    },

    public: {
      version: '1.0.0',
      env: 'development',
      replaceEndSplash: true,
    },
  },

  compatibilityDate: '2025-04-09',

  nitro: {
    esbuild: {
      options: {
        drop: dropCode
          ? ['console']
          : [],
      },
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
      Components({
        resolvers: [
          VueUseComponentsResolver(),
          IconsResolver(),
        ],
      }),
      Icons({ autoInstall: true }),
    ],
    esbuild: {
      drop: dropCode
        ? ['console', 'debugger']
        : [],
      dropLabels: dropCode
        ? ['DEV']
        : [],
    },
    optimizeDeps: {
      exclude: isMac ? ['fsevents'] : [],
    },
  },

  eslint: {
    config: {
      stylistic: true, // <---
    },
  },

  i18n: {
    // 語系代碼採含 script 子標籤的 CLDR 格式（lang-Script-Region）
    // zh-Hant / zh-Hans 為繁／簡通用基底，區域語系缺 key 時 fallback 至基底（見 i18n/i18n.config.ts）
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
    restructureDir: 'i18n',
    langDir: 'locales',

    // lang路由 https://v8.i18n.nuxtjs.org/options/routing#strategy
    strategy: 'no_prefix',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      cookieCrossOrigin: true,
      cookieSecure: true,
      redirectOn: 'root', // recommended
    },
    vueI18n: './i18n.config.ts',
  },

})
