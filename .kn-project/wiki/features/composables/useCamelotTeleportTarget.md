# useCamelotTeleportTarget

## Summary

決定浮層應該 Teleport 到哪裡：祖先有 `<dialog>` 就進該對話框，否則回落 `body`。所有 popup 概念的元件一律共用此判定。

## 簽章
```ts
export const useCamelotTeleportTarget: (
  anchor: MaybeRefOrGetter<HTMLElement | null | undefined>,
) => {
  nearestDialog: ComputedRef<Element | undefined>
  teleportTarget: ComputedRef<HTMLElement | string>
}
```

## 參數
| 參數 | 型別 | 說明 |
| --- | --- | --- |
| `anchor` | `MaybeRefOrGetter<HTMLElement \| null \| undefined>` | 浮層的錨點元素（通常是觸發器）。以它的祖先鏈判定所屬對話框。 |

## 回傳
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `nearestDialog` | `ComputedRef<Element \| undefined>` | 最近的 `<dialog>` 祖先；沒有則 `undefined`。 |
| `teleportTarget` | `ComputedRef<HTMLElement \| string>` | 可直接綁到 `<Teleport :to="...">`：對話框元素或字串 `'body'`。 |

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

## 為什麼需要它

原生 `<dialog>` 以 `showModal()` 開啟時會建立自己的 **top layer**，該層之上沒有任何一般內容。Teleport 到 `body` 的浮層無論 z-index 開多高都會被壓在對話框底下，**既看不見也點不到**。

浮層必須改 Teleport 進最近的 `<dialog>` 祖先，成為對話框內的兄弟節點後，才輪得到 z-index 決定先後（見[疊層刻度](../layering.md)）。

> [!IMPORTANT]
> 兩者是先後關係：**沒有先修好 teleport 目標，單獨調高 z-index 完全無效。**

## 使用者

| 元件 | 浮層 |
| --- | --- |
| [PopupV2](../components/PopupV2.md) | 通用彈出層（SelectV2 / DateV2 / DateRangeV2 / TimeV2 皆以它承載） |
| [CascadeMenu](../components/CascadeMenu.md) | 各層階層選單面板 |
| [TimeV2](../components/TimeV2.md) | 時分秒欄位的下拉清單 |

## 備註
- 新增任何 popup 概念的元件時，**一律使用本 composable 決定 Teleport 目標**，不要自行寫 `to="body"`。
- 浮層脫離原本的 DOM 位置後，**CSS 自訂屬性的繼承會中斷**（CSS 繼承跟著 DOM 樹，不跟元件樹；Vue 的 `provide`/`inject` 則不受影響）。目前各元件以逐面板套用色彩角色 class 補回。

---
[🧱 疊層刻度](../layering.md) ・ [🪝 Composables](../composables.md) ・ [🏠 Wiki](../../index.md)
