# Menu

## Summary

`CamelotMenu` 是行內手風琴式的多層選單清單：子層往下縮排展開，點父項展開或收合、點葉節點設為選中，選中項的祖先會一起變色標示路徑。要浮層飛出、子層往側邊展開的選單請改用 [CascadeMenu](./CascadeMenu.md)。

## Props
| Prop | 型別 | 預設 | 說明 |
| :--- | :--- | :---: | :--- |
| `items` | `CamelotMenuItem[]` | — | 選單項目清單，每項有 `label`、`value`，可含 `children` 巢狀與 `disabled` |
| `defaultExpandAll` | `boolean` | `false` | 掛載時是否預設展開所有含子項的父節點 |
| `color` | `CamelotColorRole` | `'primary'` | 色彩角色 |

## Emits
| 事件 | 參數 | 說明 |
| :--- | :--- | :--- |
| `select` | `item: CamelotMenuItem` | 選取某葉節點時觸發 |

## v-model
| Model | 型別 | 說明 |
| :--- | :--- | :--- |
| `modelValue` | `string \| number` | 目前選中項目的 `value` |
| `expanded` | `(string \| number)[]` | 已展開節點的 `value` 陣列（預設 `[]`） |

## 運作方式

### 點擊行為

1. 點含子項的項目：展開或收合，不改變選中值。
2. 點葉節點：設為選中並發出 `select`。
3. 停用項目半透明、不回應點擊。

來源：1. [Menu.vue][]　2. [MenuItem.vue][]

### 預設展開

`defaultExpandAll` 為真，且掛載時 `expanded` 仍是空陣列，才會展開所有父節點；外部已給展開清單時以外部為準。

來源：1. [Menu.vue][]

### 層級視覺

1. 子層往下縮排，左側有一條實線導引線，止於最後一個子項的中線，並轉成 L 形轉角指向它。
2. 頂層項目字重較粗，深層項目文字較淡。
3. 選中項的父層與祖先文字改用色彩角色，但不加選中底色。

來源：1. [MenuItem.vue][]

### 各主題選中樣式

| 主題 | 選中樣式 |
| :--- | :--- |
| aqua | 玻璃填滿底，文字用配對的前景色 |
| scifi | 18% 角色色底、角色色文字與文字光暈 |
| cupertino | 10% 角色色底、粗體角色色文字 |
| material | 10% 角色色底、角色色文字 |

來源：1. [MenuItem.vue][]

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| Menu.vue | [app/components/Camelot/Menu.vue](../../../../app/components/Camelot/Menu.vue) |
| MenuItem.vue | [app/components/Camelot/Internal/MenuItem.vue](../../../../app/components/Camelot/Internal/MenuItem.vue) |

[Menu.vue]: #references
[MenuItem.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
