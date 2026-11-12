WIKI_PAGE("features/components/Avatar.md",{
"title":"Avatar",
"summary":"Avatar 是頭像元件，匯入名稱 `CamelotAvatar`。有圖片網址時顯示圖片，沒有或載入失敗時顯示姓名縮寫；提供三種尺寸與色彩角色，Sci-Fi 主題是切角方塊，其餘主題是圓形。",
"svgs":{},
"seq":{},
"ext":["archive/2611121356-tactile-theme-and-new-components.md"],
"changelog":[{"plan": "2611121356-tactile-theme-and-new-components", "date": "2026-11-12", "version": "4.6.4.2", "note": "新增第五種主題風格 tactile、Button loading 與七個新元件", "issue": "[#76](https://github.com/KNightING/camelot-nuxt-layer/issues/76)", "pr": "[PR #77](https://github.com/KNightING/camelot-nuxt-layer/pull/77)"}],
"md":"# Avatar\n\n## Summary\n\nAvatar 是頭像元件，匯入名稱 `CamelotAvatar`。有圖片網址時顯示圖片，沒有或載入失敗時顯示姓名縮寫；提供三種尺寸與色彩角色，Sci-Fi 主題是切角方塊，其餘主題是圓形。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :--- | :--- |\n| `name` | `string` | `''` | 姓名；圖片的替代文字，也是縮寫的來源 |\n| `src` | `string` | `''` | 圖片網址 |\n| `size` | `CamelotAvatarSize` | `'md'` | 尺寸：sm 32px、md 42px、lg 56px |\n| `color` | `CamelotColorRole` | `'primary'` | 縮寫底色的色彩角色 |\n\n## Slots\n| Slot | 作用域參數 | 說明 |\n| :--- | :--- | :--- |\n| `default` | — | 取代縮寫的自訂內容；有圖片時不顯示 |\n\n## 規則\n| 規則 | 說明 |\n| :--- | :--- |\n| 拉丁字母姓名 | 取前兩個字元並轉大寫 |\n| 其他文字 | 取第一個字，避免兩個全形字塞不進小尺寸 |\n| 圖片載入失敗 | 退回顯示縮寫；圖片網址變更後會重新嘗試 |\n\n來源：1. [Avatar.vue](../../../../app/components/Camelot/Avatar.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});
