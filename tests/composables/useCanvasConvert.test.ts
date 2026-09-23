import { describe, expect, it, vi } from 'vitest'

describe('useCanvasConvert.toBlob', () => {
  it('把格式與品質傳給 canvas.toBlob', async () => {
    const canvas = document.createElement('canvas')
    const toBlob = vi.fn((cb: BlobCallback) => cb(new Blob()))
    canvas.toBlob = toBlob as unknown as HTMLCanvasElement['toBlob']
    await useCanvasConvert(canvas).toBlob('image/jpeg', 0.8)
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.8)
  })
})
