import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import Unimport from 'unimport/unplugin'

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
          from: fileURLToPath(new URL('./tests/nuxt-stubs.ts', import.meta.url)),
        },
        {
          name: 'useAsyncData',
          from: fileURLToPath(new URL('./tests/nuxt-stubs.ts', import.meta.url)),
        },
      ],
    }),
  ],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
})
