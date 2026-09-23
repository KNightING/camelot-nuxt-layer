# useLocale

## Summary

`useLocale` 是語系格式正規化 composable：把單一 locale 字串正規化成 `bcp47`、`cldr`、`l10n` 三種表示，各為一個 computed。輸入可為 bcp47 或 cldr 格式，大小寫不敏感，底線與連字號分隔皆可；參數型別是 `MaybeRefOrGetter<string | undefined>`。

## 運作方式

### 三種輸出

| 輸出 | 規則 | 例 |
| :--- | :--- | :--- |
| `cldr` | 常見語言補上完整的語言、文字、地區三段；輸入已帶文字子標籤則保留；不在對照表的語言回 `undefined` | zh-TW 得 zh-Hant-TW |
| `bcp47` | 由 cldr 反推，沒有 cldr 時用正規化後的輸入；移除文字子標籤、保留地區 | zh-Hant-TW 得 zh-TW |
| `l10n` | 依序取 cldr、bcp47、原始輸入中第一個有值者 | en-US 得 en-US |

來源：1. [useLocale.ts][]

### 解析流程

這張圖回答：一個 locale 字串怎麼被解析成三種輸出？

```json diagram id=圖1
{
  "type": "flow",
  "dir": "TD",
  "title": "locale 解析",
  "desc": "先統一分隔符與大小寫，再依是否自帶文字子標籤或命中對照表決定 cldr，最後推出 bcp47 與 l10n",
  "nodes": [
    {"id": "A", "text": "locale 輸入", "shape": "stadium"},
    {"id": "B", "text": "統一分隔與大小寫"},
    {"id": "C", "text": "含文字子標籤?", "shape": "diamond"},
    {"id": "D", "text": "cldr 保留輸入"},
    {"id": "E", "text": "對照表命中?", "shape": "diamond"},
    {"id": "F", "text": "cldr 取對照值"},
    {"id": "G", "text": "cldr 為空"},
    {"id": "H", "text": "去文字得 bcp47"},
    {"id": "I", "text": "取 l10n", "key": true}
  ],
  "edges": [
    {"from": "A", "to": "B"},
    {"from": "B", "to": "C"},
    {"from": "C", "to": "D", "label": "是"},
    {"from": "C", "to": "E", "label": "否"},
    {"from": "E", "to": "F", "label": "是"},
    {"from": "E", "to": "G", "label": "否"},
    {"from": "D", "to": "H"},
    {"from": "F", "to": "H"},
    {"from": "G", "to": "H"},
    {"from": "H", "to": "I"}
  ]
}
```

![locale 解析](locale.圖1.svg)

1. 底線換成連字號，依 BCP 47 慣例統一大小寫：語言小寫、文字首字大寫、地區大寫。
2. 已帶文字子標籤，例如 zh-Hant-TW 或 zh-Hant，視為已是 cldr，直接保留。
3. 否則查 CLDR 對照表，命中取對照值，未命中為空。
4. bcp47 由 cldr 或正規化輸入移除文字子標籤而得。
5. l10n 依序退回 cldr、bcp47、原始輸入。

來源：1. [useLocale.ts][]

### CLDR 對照表

對照表只收帶地區的 key；裸語言碼一律不擴展，行為與不在表內的語言相同。

涵蓋 11 種語言：中文 zh、塞爾維亞 sr、烏茲別克 uz、亞塞拜然 az、哈薩克 kk、蒙古 mn、庫德 ku、旁遮普 pa、信德 sd、塔吉克 tg、韃靼 tt。

| 輸入 | 對照值 |
| :--- | :--- |
| zh-CN | zh-Hans-CN |
| zh-TW | zh-Hant-TW |
| sr-ME | sr-Latn-ME |
| mn-CN | mn-Mong-CN |
| uz-AF | uz-Arab-AF |
| pa-PK | pa-Arab-PK |
| sd-IN | sd-Deva-IN |

來源：1. [useLocale.ts][]

## 行為範例

| 輸入 | bcp47 | cldr | l10n |
| :--- | :--- | :--- | :--- |
| zh-TW、zh-Hant-TW、zh_Hant_TW、ZH-tw | zh-TW | zh-Hant-TW | zh-Hant-TW |
| zh-CN | zh-CN | zh-Hans-CN | zh-Hans-CN |
| zh，裸碼 | zh | `undefined` | zh |
| zh-Hant，只有文字子標籤 | zh | zh-Hant | zh-Hant |
| en-US | en-US | `undefined` | en-US |
| `undefined` | `undefined` | `undefined` | `undefined` |

## 相關頁面

- [i18n 語系系統](./i18n-locales.md)：專案語系註冊與 fallback 鏈
- [FieldLabel](../features/components/FieldLabel.md)
- [useLocale 參考頁](../features/composables/useLocale.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useLocale.ts | [app/composables/useLocale.ts](../../../app/composables/useLocale.ts) |

[useLocale.ts]: #references

---
[⚙️ Env](../environment.md) | [🏠 Wiki](../index.md)
