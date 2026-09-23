# 浮層傳送目標

## Summary

`useCamelotTeleportTarget(anchor)` 決定浮層應該 Teleport 到哪裡：錨點的祖先有 `<dialog>` 就進該對話框，否則回落 body。新增任何 popup 概念的元件都用它決定 Teleport 目標，不要自行寫死 body。

## 運作方式

### 判定方式

1. 取錨點元素，沒有元素時視為不在對話框內。
2. 以 closest 往上找最近的 dialog 祖先。
3. 找到就回傳該元素，否則回傳字串 body，可直接綁到 Teleport 的 to。
4. 兩者都是 computed，錨點變動時自動重算。

來源：1. [useCamelotTeleportTarget.ts][]

### 為什麼需要它

原生 `<dialog>` 以 showModal 開啟時會建立自己的 top layer，該層之上沒有任何一般內容。

Teleport 到 body 的浮層無論 z-index 開多高，都會被壓在對話框底下，既看不見也點不到。

浮層改 Teleport 進最近的對話框祖先，成為對話框內的節點後，才輪得到 z-index 決定先後，見[疊層刻度](../../platform/layering.md)。

> [!IMPORTANT]
> 兩者是先後關係：**沒有先修好 Teleport 目標，單獨調高 z-index 完全無效。**

來源：1. [useCamelotTeleportTarget.ts][]

### 使用者

| 元件 | 浮層 |
| --- | --- |
| [Tooltip](../components/Tooltip.md) | 提示浮層 |
| [CascadeMenu](../components/CascadeMenu.md) | 各層飛出面板，由內部 CascadeMenuPanel 呼叫 |
| [Internal TimeField](../components/Internal-TimeField.md) | 時、分、秒欄位的下拉清單 |

[PopupV2](../components/PopupV2.md) 沒有使用本 composable，而是自行往上找對話框祖先，並提供 teleport prop 讓呼叫端指定目標。

來源：1. [Tooltip.vue][]　2. [CascadeMenuPanel.vue][]　3. [TimeField.vue][]　4. [PopupV2.vue][]

### 注意事項

浮層離開原本的 DOM 位置後，CSS 自訂屬性的繼承會中斷：CSS 繼承跟著 DOM 樹，不跟元件樹；Vue 的 provide 與 inject 不受影響。

目前各元件在浮層面板上再套一次色彩角色 class，補回當前色變數。

來源：1. [CascadeMenuPanel.vue][]

## 用法

```vue
<template>
  <div ref="root">
    <Teleport :to="teleportTarget">
      <div class="fixed" :style="{ zIndex: 'var(--cml-z-popup)' }">
        <!-- 浮層內容 -->
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const root = useTemplateRef<HTMLElement>('root')
const { teleportTarget } = useCamelotTeleportTarget(root)
</script>
```

## 簽章

```ts
useCamelotTeleportTarget(
  anchor: MaybeRefOrGetter<HTMLElement | null | undefined>,
): {
  nearestDialog: ComputedRef<HTMLDialogElement | undefined>
  teleportTarget: ComputedRef<HTMLElement | string>
}
```

## 參數

| 參數 | 型別 | 說明 |
| --- | --- | --- |
| `anchor` | `MaybeRefOrGetter<HTMLElement \| null \| undefined>` | 浮層的錨點，通常是觸發器 |

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `nearestDialog` | `ComputedRef<HTMLDialogElement \| undefined>` | 最近的 dialog 祖先；沒有則為 `undefined` |
| `teleportTarget` | `ComputedRef<HTMLElement \| string>` | 對話框元素或字串 `'body'` |

## 相關頁面

- [疊層刻度](../../platform/layering.md)
- [Composables 清單](../composables.md)

## Changelog

| 日期 | 版本 | 計畫 | 變動 | Issue | PR |
|---|---|---|---|---|---|
| 2026-09-23 | — | [2609231616-wiki-lint-migration](../../../archive/2609231616-wiki-lint-migration.md) | 改寫為新版 wiki 格式並依原始碼校正內容 | [#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45) | — |

## References

| 來源 | 位置 |
|---|---|
| useCamelotTeleportTarget.ts | [app/composables/useCamelotTeleportTarget.ts](../../../../app/composables/useCamelotTeleportTarget.ts) |
| Tooltip.vue | [app/components/Camelot/Tooltip.vue](../../../../app/components/Camelot/Tooltip.vue) |
| CascadeMenuPanel.vue | [app/components/Camelot/Internal/CascadeMenuPanel.vue](../../../../app/components/Camelot/Internal/CascadeMenuPanel.vue) |
| TimeField.vue | [app/components/Camelot/Internal/TimeField.vue](../../../../app/components/Camelot/Internal/TimeField.vue) |
| PopupV2.vue | [app/components/Camelot/PopupV2.vue](../../../../app/components/Camelot/PopupV2.vue) |

[useCamelotTeleportTarget.ts]: #references
[Tooltip.vue]: #references
[CascadeMenuPanel.vue]: #references
[TimeField.vue]: #references
[PopupV2.vue]: #references

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
