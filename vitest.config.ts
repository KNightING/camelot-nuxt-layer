import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import Unimport from 'unimport/unplugin'

// unimport 會把 from 原樣寫進 import 字串；Windows 路徑的反斜線在字串中是跳脫字元（\t、\n），一律轉成 POSIX 斜線
const nuxtStubsPath = fileURLToPath(new URL('./tests/nuxt-stubs.ts', import.meta.url)).replaceAll('\\', '/')

// composables 依賴 Nuxt 自動匯入；測試以 unimport 重建同一組匯入，
// Nuxt 執行期 API（useState、useAsyncData）改由輕量替身提供，不啟動 Nuxt。
export default defineConfig({
  plugins: [
    Unimport.vite({
      // toRef 與 vue 同名，Nuxt 採用 vue 的版本
      presets: ['vue', {
        package: '@vueuse/core',
        ignore: ['toRef', 'toRefs', 'toValue'],
      }],
      dirs: ['./app/composables'],
      imports: [
        {
          name: 'useState',
          from: nuxtStubsPath,
        },
        {
          name: 'useAsyncData',
          from: nuxtStubsPath,
        },
      ],
    }),
  ],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
})
