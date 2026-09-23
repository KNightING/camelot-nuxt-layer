import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

describe('useInfinitePage', () => {
  it('伺服器端渲染（沒有 window）不會拋錯', async () => {
    const app = createSSRApp({
      setup() {
        useInfinitePage({
          nextPage: () => {},
          isPending: ref(false),
        })
        return () => h('div')
      },
    })
    const original = globalThis.window
    // @ts-expect-error 模擬伺服器端：window 在型別上不可刪除，測試需暫時移除
    delete globalThis.window
    try {
      await expect(renderToString(app)).resolves.toBe('<div></div>')
    }
    finally {
      globalThis.window = original
    }
  })
})
