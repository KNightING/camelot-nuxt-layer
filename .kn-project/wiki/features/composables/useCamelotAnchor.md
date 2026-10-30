# 浮層錨點定位

## Summary

`useCamelotAnchor()` 為一個浮層實例建立唯一的 CSS anchor 名稱，並偵測瀏覽器是否支援 CSS Anchor Positioning。支援時浮層由瀏覽器依觸發元素原生同步定位，捲動不會落後；不支援時呼叫端退回 JS 量測。PopupV2、Tooltip、CascadeMenu 共用它，新增浮層元件不要自行偵測。

## 運作方式

### 判定與命名

1. 掛載後以 `CSS.supports('anchor-name', …)` 偵測支援；SSR 與 hydration 首幀一律視為不支援，避免兩端輸出不一致。
2. 以元件實例的 id 產生 `--camelot-anchor-*` 名稱，移除 id 中不合法的字元，每個實例各自唯一。
3. 支援時，`targetStyle` 提供觸發元素的 `anchor-name`，`floatingStyle` 提供浮層的 `position-anchor` 與 `position-visibility: anchors-visible`。
4. 不支援時兩者皆為空，呼叫端走原本的 JS 量測路徑。

來源：1. [useCamelotAnchor.ts](../../../../app/composables/useCamelotAnchor.ts)

### 為什麼需要它

浮層以 JS 每幀量測觸發元素再寫入座標時，合成器先捲動，浮層會晚一到數幀才跟上。

改由瀏覽器依 anchor 原生計算位置後，與觸發元素同一幀移動；觸發元素被捲出捲動容器可視範圍時，浮層也會一併隱藏。

來源：1. [useCamelotAnchor.ts](../../../../app/composables/useCamelotAnchor.ts)

### 使用者

| 元件 | 用法 |
| --- | --- |
| [PopupV2](../components/PopupV2.md) | 外層容器以 anchor 對齊觸發元素，尺寸與座標原生同步 |
| [Tooltip](../components/Tooltip.md) | 以 position-area 置於觸發元素上方，空間不足時翻面 |
| [Internal CascadeMenuPanel](../components/Internal-CascadeMenuPanel.md) | 根面板以觸發器、子面板以被 hover 的列為錨點 |

來源：1. [PopupV2.vue](../../../../app/components/Camelot/PopupV2.vue)　2. [Tooltip.vue](../../../../app/components/Camelot/Tooltip.vue)　3. [CascadeMenuPanel.vue](../../../../app/components/Camelot/Internal/CascadeMenuPanel.vue)

## 用法

```vue
<template>
  <div :style="targetStyle">
    <Teleport to="body">
      <div class="fixed" :style="floatingStyle">
        <!-- 浮層內容 -->
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { supported, targetStyle, floatingStyle } = useCamelotAnchor()
</script>
```

## 簽章

```ts
useCamelotAnchor(): {
  name: string
  supported: Ref<boolean>
  targetStyle: ComputedRef<{ anchorName: string } | undefined>
  floatingStyle: ComputedRef<{ positionAnchor: string, positionVisibility: string } | undefined>
}
```

## 回傳

| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `name` | `string` | 此實例唯一的 anchor 名稱，供命令式寫入外部元素時使用 |
| `supported` | `Ref<boolean>` | 掛載後才確定；`false` 時呼叫端走 JS 退回路徑 |
| `targetStyle` | `ComputedRef` | 套在觸發元素；不支援時為 `undefined` |
| `floatingStyle` | `ComputedRef` | 套在浮層元素；不支援時為 `undefined` |

另匯出純函式 `isCssAnchorSupported()` 與 `createAnchorName(id)`，不依賴元件實例，可單獨測試。

## 相關頁面

- [浮層傳送目標](useCamelotTeleportTarget.md)
- [PopupV2](../components/PopupV2.md)
- [Composables 清單](../composables.md)

---
[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)
