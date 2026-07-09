# useAutoLink

> 將純文字中的網址、Email、電話號碼自動轉換為對應的 HTML 超連結。

## 簽章
```ts
useAutoLink(
  textRef: MaybeRefOrGetter<string | undefined>,
  options?: MaybeRef<AutoLinkOptions>
): ComputedRef<string>

type AutoLinkOptions = {
  disabledUrl?: boolean
  disabledEmail?: boolean
  disabledPhone?: boolean
}
```

## 參數
| 參數 | 型別 | 預設 | 說明 |
| --- | --- | --- | --- |
| `textRef` | `MaybeRefOrGetter<string \| undefined>` | — | 要處理的原始文字。為 `undefined` 時回傳空字串。 |
| `options` | `MaybeRef<AutoLinkOptions>` | `undefined` | 控制各類型轉換是否停用。 |
| `options.disabledUrl` | `boolean` | `false` | 為 `true` 時不轉換網址。 |
| `options.disabledEmail` | `boolean` | `false` | 為 `true` 時不轉換 Email。 |
| `options.disabledPhone` | `boolean` | `false` | 為 `true` 時不轉換電話號碼。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| （回傳值） | `ComputedRef<string>` | 已將符合的內容替換為 `<a>` 標籤的 HTML 字串。 |

## 用法
```ts
const html = useAutoLink('聯絡 www.example.com 或 test@mail.com')
// html.value 內含對應的 <a> 連結
```

## 備註
- 網址連結會加上 `target="_blank" rel="noopener noreferrer"`；`www.` 開頭且無協議者會自動補上 `http://`。
- Email 轉換為 `mailto:` 連結。
- 電話號碼清理後（移除 `-`、空格、括號）長度小於 7 者不轉換，否則轉為 `tel:` 連結。
- 電話 Regex 為簡化版本，可能誤判或無法涵蓋所有格式。
- 回傳為 HTML 字串，需使用 `v-html` 之類方式渲染。

---
[🏠 Wiki](../index.md)
