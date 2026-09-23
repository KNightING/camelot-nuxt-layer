import { describe, expect, it } from 'vitest'

describe('useFileToDataURL', () => {
  it('讀檔成功回傳 data URL', async () => {
    const {
      data, error,
    } = await useFileToDataURL(new File(['hi'], 'a.txt', { type: 'text/plain' }))
    expect(error.value).toBeNull()
    expect(data.value).toMatch(/^data:text\/plain/)
  })

  it('讀檔失敗時會結束並帶出錯誤', async () => {
    const original = FileReader.prototype.readAsDataURL
    FileReader.prototype.readAsDataURL = function () {
      queueMicrotask(() => this.dispatchEvent(new Event('error')))
    }
    try {
      const result = await Promise.race([
        useFileToDataURL(new File(['x'], 'b.txt')),
        new Promise(resolve => setTimeout(() => resolve('timeout'), 200)),
      ])
      expect(result).not.toBe('timeout')
      expect((result as { error: Ref<unknown> }).error.value).toBeTruthy()
    }
    finally {
      FileReader.prototype.readAsDataURL = original
    }
  })
})
