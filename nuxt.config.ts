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
    // Layer 只提供語言層級基底字典（zh 為繁體），會被消費端 app 繼承。
    // 區域語系（如 zh-Hant-TW、zh-Hans-CN）由消費端註冊，
    // 靠 vue-i18n 隱含階層 fallback（zh-Hant-TW → zh-Hant → zh）落回基底，範例見 .playground。
    locales: [
      {
        name: 'English',
        code: 'en',
        language: 'en',
        file: 'en.json',
      },
      {
        name: '中文',
        code: 'zh',
        language: 'zh',
        file: 'zh.json',
      },
    ],
    defaultLocale: 'zh',
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
