import { describe, expect, it } from 'vitest'

describe('useLazyImage', () => {
  it('src 為空時結束載入並標記錯誤', () => {
    const img = useLazyImage('', { immediate: true })
    expect(img.isLoading.value).toBe(false)
    expect(img.isPending.value).toBe(false)
    expect(img.isError.value).toBe(true)
  })
})
