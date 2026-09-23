import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => vi.restoreAllMocks())

describe('useBlobDownload', () => {
  it('下載後釋放 object URL', async () => {
    vi.useFakeTimers()
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:x')
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    useBlobDownload(new Blob(['x']), 'a.txt')
    expect(create).toHaveBeenCalledOnce()
    vi.runAllTimers()
    expect(revoke).toHaveBeenCalledWith('blob:x')
    vi.useRealTimers()
  })
})
