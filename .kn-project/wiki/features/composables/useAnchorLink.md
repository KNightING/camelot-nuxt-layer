# useAnchorLink

## Summary

`useAnchorLink(url, options)` 建立一個不掛進 DOM 的 `<a>` 錨點元素，呼叫 `open()` 時以程式方式點擊它，開啟指定網址；未指定開啟目標時在新分頁開啟。錨點在第一次 `open()` 時才建立，因此 `open()` 只能在瀏覽器端執行。

## 運作方式

1. 錨點元素由 computed 產生，網址或選項變動時重新建立。
2. computed 是惰性的：第一次呼叫 `open()` 時才真正建立元素。
3. 建立時先把開啟目標設為新分頁，選項有指定目標時再覆寫。
4. `open()` 對元素呼叫 click，由瀏覽器處理導覽。

來源：1. [useAnchorLink.ts][]

## 用法

```ts
const { open } = useAnchorLink('https://example.com', { target: '_self' })
open()
```

來源：1. [useAnchorLink.ts][]

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
| `url` | `MaybeRef<string>` | — | 要開啟的網址 |
| `options` | `MaybeRef<AnchorLinkOptions \| undefined>` | `undefined` | 選項物件 |
| `options.target` | `'_self' \| '_blank' \| '_parent' \| '_top' \| '_unfencedTop'` | `'_blank'` | 錨點的開啟目標 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `open` | `() => void` | 點擊目前的錨點元素，開啟網址 |

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useAnchorLink.ts | [app/composables/useAnchorLink.ts](../../../../app/composables/useAnchorLink.ts) |

[useAnchorLink.ts]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
