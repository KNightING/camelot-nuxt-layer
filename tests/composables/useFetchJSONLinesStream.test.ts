import { afterEach, describe, expect, it, vi } from 'vitest'

const mockFetch = (chunks: string[]) => {
  const encoder = new TextEncoder()
  vi.stubGlobal('fetch', vi.fn(async () => new Response(new ReadableStream({
    start(controller) {
      chunks.forEach(c => controller.enqueue(encoder.encode(c)))
      controller.close()
    },
  }))))
}

afterEach(() => vi.unstubAllGlobals())

describe('useFetchJSONLinesStream', () => {
  it('結尾沒有換行的最後一行也會被解析', async () => {
    mockFetch(['{"a":1}\n{"a"', ':2}\n{"a":3}'])
    const stream = useFetchJSONLinesStream<{ a: number }>('/x', { immediate: false })
    await stream.refresh()
    expect(stream.data.value).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
  })

  it('預設遇到解析錯誤即中止，不再解析後續的行', async () => {
    mockFetch(['{"a":1}\nnot-json\n{"a":3}\n'])
    const onParseError = vi.fn()
    const stream = useFetchJSONLinesStream<{ a: number }>('/x', {
      immediate: false,
      onParseError,
    })
    await stream.refresh()
    expect(onParseError).toHaveBeenCalledOnce()
    expect(stream.data.value).toEqual([{ a: 1 }])
  })

  it('finishOnParseError: false 時略過錯誤行繼續', async () => {
    mockFetch(['{"a":1}\nnot-json\n{"a":3}\n'])
    const stream = useFetchJSONLinesStream<{ a: number }>('/x', {
      immediate: false,
      finishOnParseError: false,
    })
    await stream.refresh()
    expect(stream.data.value).toEqual([{ a: 1 }, { a: 3 }])
  })
})
