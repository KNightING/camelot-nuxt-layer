WIKI_PAGE("features/components/AvatarGroup.md",{
"title":"AvatarGroup",
"summary":"AvatarGroup 把多個 [Avatar](./Avatar.md) 重疊成一排，匯入名稱 `CamelotAvatarGroup`。超過上限的人數以「+N」表示，滑鼠滑過整組時頭像會展開成不重疊。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# AvatarGroup\n\n## Summary\n\nAvatarGroup 把多個 [Avatar](./Avatar.md) 重疊成一排，匯入名稱 `CamelotAvatarGroup`。超過上限的人數以「+N」表示，滑鼠滑過整組時頭像會展開成不重疊。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `items` | `CamelotAvatarItem[]` | `[]` | 頭像資料；每項有 name，選填 src 與 color |\n| `max` | `number` | `5` | 最多顯示幾個頭像 |\n| `size` | `CamelotAvatarSize` | `'md'` | 全部頭像的尺寸 |\n| `color` | `CamelotColorRole` | `'primary'` | 項目未指定 color 時的預設色彩角色 |\n\n## 規則\n| 規則 | 說明 |\n| :--- | :--- |\n| 重疊量 | 跟著尺寸變化，尺寸越大重疊越多 |\n| 分隔 | 每個頭像外有一圈表面色外框；Sci-Fi 主題不畫外框 |\n| 滑過單一頭像 | 該頭像上移 4px |\n\n來源：1. [AvatarGroup.vue](../../../../app/components/Camelot/AvatarGroup.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});
