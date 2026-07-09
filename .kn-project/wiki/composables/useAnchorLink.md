# useAnchorLink

> 建立一個隱藏的 `<a>` 錨點元素，用來以程式方式開啟指定網址。

## 簽章
```ts
useAnchorLink(
  url: MaybeRef<string>,
  options?: MaybeRef<AnchorLinkOptions | undefined>
): { open: () => void }

type AnchorLinkOptions = {
  target?: '_self' | '_blank' | '_parent' | '_top' | '_unfencedTop'
}
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `url` | `MaybeRef<string>` | — | 要開啟的網址。 |
| `options` | `MaybeRef<AnchorLinkOptions \| undefined>` | `undefined` | 選項物件，可指定 `target`。 |
| `options.target` | `'_self' \| '_blank' \| '_parent' \| '_top' \| '_unfencedTop'` | `'_blank'` | 錨點的開啟目標。未提供時預設為 `'_blank'`。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `open` | `() => void` | 觸發錨點元素的 `click()`，開啟網址。 |

## 用法
```ts
const { open } = useAnchorLink('https://example.com', { target: '_blank' })
open()
```

## 備註
- 錨點元素由 `computed` 建立，會在 `url` 或 `options` 變動時重新計算。
- 內部使用 `document.createElement('a')`，僅能在瀏覽器環境（client）呼叫。

---
[🏠 Wiki](../index.md)
