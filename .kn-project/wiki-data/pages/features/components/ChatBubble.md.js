WIKI_PAGE("features/components/ChatBubble.md",{
"title":"ChatBubble",
"summary":"ChatBubble 是訊息對話泡泡，匯入名稱 `CamelotChatBubble`。分為對方與自己兩種方向：對方靠左、中性底色，自己靠右、強調色；出現時從尾巴那一角放大淡入，可在泡泡下方附時間等補充資訊。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# ChatBubble\n\n## Summary\n\nChatBubble 是訊息對話泡泡，匯入名稱 `CamelotChatBubble`。分為對方與自己兩種方向：對方靠左、中性底色，自己靠右、強調色；出現時從尾巴那一角放大淡入，可在泡泡下方附時間等補充資訊。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `text` | `string` | `''` | 訊息文字 |\n| `side` | `CamelotChatBubbleSide` | `'start'` | start 對方靠左、end 自己靠右 |\n| `color` | `CamelotColorRole` | `'primary'` | 自己那一側泡泡使用的色彩角色 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 取代文字的自訂內容 |\n| `meta` | — | 泡泡下方的補充資訊，例如時間 |\n\n## 外觀\n| 主題 | 自己 | 對方 |\n| :--- | :--- | :--- |\n| tactile | 反相表面 | 實心灰階底 |\n| aqua | 玻璃填色 | 玻璃軌道底 |\n| scifi | 角色色框線加外發光 | 淡色框線 |\n| cupertino、material | 角色色平塗 | 表面容器色 |\n\n來源：1. [ChatBubble.vue](../../../../app/components/Camelot/ChatBubble.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});
