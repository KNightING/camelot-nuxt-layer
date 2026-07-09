# useFetchJSONLinesStream

> 在 `useFetchStream` 之上，以逐行（JSON Lines）方式解析串流資料，逐筆解析並累積為陣列。

## 簽章
```ts
const useFetchJSONLinesStream: <T>(
  url: MaybeRefOrGetter<string>,
  options?: UseFetchJSONLinesStreamOptions<T>,
) => {
  // 繼承自 useFetchStream：status, error, abort 等
  data: Ref<T[]>
  refresh: () => Promise<void>
  clear: () => void
}
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `url` | `MaybeRefOrGetter<string>` | — | 串流請求的網址。 |
| `options` | `UseFetchJSONLinesStreamOptions<T>` | `{}` | 選項物件，見下。 |

### options（`UseFetchJSONLinesStreamOptions<T>`）
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `onLineParsed` | `(data: T) => void` | — | 當一行成功解析時的回呼。 |
| `onParseError` | `(error: Error, line: string) => void` | — | 當一行解析失敗時的回呼，回傳錯誤與原始行文本。 |
| `onFinish` | `(data: T[]) => void` | — | 串流結束時的回呼，帶入累積的資料陣列。 |
| `decoder` | `TextDecoder` | `new TextDecoder('utf-8')` | 解碼二進位資料塊的解碼器。 |
| `lineBreak` | `string` | `'\n'` | 換行符號。 |
| `parse` | `(line: string) => T \| null` | `JSON.parse` | 單行解析函式。 |
| `finishOnParseError` | `boolean` | `true` | 解析失敗時是否中止串流（`stream.abort()`）。 |
| `keepData` | `boolean` | `true` | 是否將解析結果累積至 `data`。 |
| 其他 | `BaseOptions` | — | `Omit<UseFetchStreamOptions, 'onChunk' \| 'onFinish'>` 的其餘選項會傳遞給底層 `useFetchStream`。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `data` | `Ref<T[]>` | 累積的解析結果陣列（覆寫底層 stream 的 data）。 |
| `refresh` | `() => Promise<void>` | 先 `clear()` 再呼叫底層 `stream.refresh()`。 |
| `clear` | `() => void` | 清空 `data`、行緩衝並呼叫 `stream.clear()`。 |
| （其他） | — | 展開自底層 `useFetchStream`，含 `status`、`error`、`abort` 等。 |

## 用法
```ts
const { data, refresh } = useFetchJSONLinesStream<MyItem>('/api/stream', {
  onLineParsed: item => console.log(item),
  onParseError: (err, line) => console.warn(err, line),
})
await refresh()
```

## 備註
- 內部以 `lineBuffer` 緩存不完整行，收到資料塊時以 `lineBreak` 分割並保留最後一段。
- 空行（`!line.trim()`）會被忽略。
- 串流結束時若緩衝區仍有內容會再處理一次，以涵蓋結尾無換行符的情況。
- 底層 `useFetchStream` 的 `keepData` 被強制設為 `false`，避免累積 `Uint8Array`。
- `onError` 會轉呼叫 `options.onError`。

---
[🏠 Wiki](../index.md)
