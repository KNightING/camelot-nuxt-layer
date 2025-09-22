// Omit 用於從 UseFetchStreamOptions 中排除我們將要覆蓋的屬性，以避免型別衝突
type BaseOptions = Omit<UseFetchStreamOptions, 'onChunk' | 'onFinish'>

// 定義我們新 Composable 的選項
export interface UseFetchJSONLinesStreamOptions<T> extends BaseOptions {

  /**
   * 當一行成功解析時的回呼
   */
  onLineParsed?: (data: T) => void

  /**
   * 當一行解析失敗時的回呼，返回錯誤和原始行文本
   */
  onParseError?: (error: Error, line: string) => void

  onFinish?: (data: T[]) => void

  decoder?: TextDecoder

  /**
   * 換行符號
   *
   * @default '\n'
   */
  lineBreak?: string

  parse?: (line: string) => T | null

  finishOnParseError?: boolean
}

export const useFetchJSONLinesStream = <T>(
  url: MaybeRefOrGetter<string>,
  options: UseFetchJSONLinesStreamOptions<T> = {},
) => {
  const {
    onLineParsed,
    onParseError,
    keepData = true,
    decoder = new TextDecoder('utf-8'),
    lineBreak = '\n',
    finishOnParseError = true,
    parse = JSON.parse,
    // 將其他選項傳遞給底層的 useFetchStream
    ...streamOptions
  } = options

  // 1. 建立此 Composable 的核心狀態
  // data 現在是泛型 T 的陣列
  const data = ref<T[]>([])

  // 用於緩存不完整的行
  let lineBuffer = ''

  // 處理緩衝區中的完整行
  const processBuffer = async () => {
    // 尋找換行符
    const lines = lineBuffer.split(lineBreak)

    // 最後一個元素可能是不完整的行，將其放回緩衝區
    lineBuffer = lines.pop() || ''

    for (const line of lines) {
      // 忽略空行
      if (!line.trim()) continue

      try {
        const parsed = parse(line)
        if (keepData) {
          (data.value as T[]).push(parsed)
        }
        onLineParsed?.(parsed)
      }
      catch (e: any) {
        onParseError?.(e, line)

        if (options.finishOnParseError) {
          // 如果設置了 finishOnParseError，則終止串流
          stream.abort()
        }
      }
    }
  }

  // 2. 在內部使用 useFetchStream
  const stream = useFetchStream(url, {
    ...streamOptions,
    // 我們將 keepData 設為 false，因為我們不需要 useFetchStream 累積 Uint8Array
    keepData: false,
    onChunk: async (chunk: Uint8Array) => {
      // 將收到的二進位數據塊解碼並加入緩衝區
      lineBuffer += decoder.decode(chunk, { stream: true })
      // 處理緩衝區中可能已完整的行
      await processBuffer()
    },
    onFinish: async () => {
      // 串流結束後，處理緩衝區中剩餘的最後一行（如果文件末尾沒有換行符）
      if (lineBuffer.trim()) {
        await processBuffer()
        // 確保最後的緩衝區也被清空
        lineBuffer = ''
      }
      // 觸發使用者傳入的 onFinish
      options.onFinish?.(data.value as T[])
    },
    onError: async (error: Error) => {
      // 將錯誤傳遞出去
      options.onError?.(error)
    },
  })

  // 3. 組合並暴露 API
  // 我們需要覆寫 refresh 和 clear 方法，以確保我們自己的狀態 (data) 也被重置
  const refresh = async () => {
    clear()
    // 呼叫底層 stream 的 refresh 方法，並等待它完成
    await stream.refresh()
  }

  const clear = () => {
    data.value = []
    lineBuffer = ''
    stream.clear()
  }

  // 建立我們自己的 shell 物件，組合了新狀態和底層的控制項
  const shell = {
    ...stream, // 繼承 status, error, abort 等
    data, // 使用我們自己的 data ref
    refresh, // 使用我們覆寫的 refresh 方法
    clear, // 使用我們覆寫的 clear 方法
  }

  return shell
}
