WIKI_PAGE("features/components/Cupertino-Radio.md",{
"title":"Cupertino Radio",
"summary":"Cupertino Radio 是 Cupertino 主題（iOS 風格）的單選圓鈕外觀實作，匯入名稱 `CamelotCupertinoRadio`。一般在 Cupertino 主題下由 [Radio](./Radio.md) 自動選用；預設選取後不能再點掉，開啟可取消選取時才允許點已選項取消。",
"svgs":{},
"seq":{},
"ext":["archive/2609231616-wiki-lint-migration.md"],
"changelog":[{"plan": "2609231616-wiki-lint-migration", "date": "2026-09-23", "version": "—", "note": "改寫為新版 wiki 格式並依原始碼校正內容", "issue": "[#45](https://github.com/KNightING/camelot-nuxt-layer/issues/45)", "pr": "—"}],
"md":"# Cupertino Radio\n\n## Summary\n\nCupertino Radio 是 Cupertino 主題（iOS 風格）的單選圓鈕外觀實作，匯入名稱 `CamelotCupertinoRadio`。一般在 Cupertino 主題下由 [Radio](./Radio.md) 自動選用；預設選取後不能再點掉，開啟可取消選取時才允許點已選項取消。\n\n## Props\n| Prop | 型別 | 預設 | 說明 |\n| :--- | :--- | :---: | :--- |\n| `disabled` | `boolean` | `false` | 是否停用 |\n| `deselectable` | `boolean` | `false` | 點擊已選取項可取消選取（非必填情境） |\n\n## Emits\n| 事件 | 參數 | 說明 |\n| :--- | :--- | :--- |\n| `change` | `checked: boolean` | 選取狀態切換時觸發 |\n\n## v-model\n| Model | 型別 | 說明 |\n| :--- | :--- | :--- |\n| `modelValue` | `boolean`（預設 `false`） | 是否為選取狀態 |\n\n## 運作方式\n\n| 狀態 | 行為 |\n|---|---|\n| 未選取 | 只有淡色外框，點擊後選取 |\n| 已選取 | 以目前角色色填滿，中央顯示 8px 白點 |\n| 已選取再點 | 預設不變；開啟可取消選取時改回未選取 |\n| 停用 | 半透明並灰階，點擊無效 |\n\n來源：1. [Cupertino/Radio.vue](../../../../app/components/Camelot/Cupertino/Radio.vue)\n\n---\n[⚙️ Env](../../environment.md) | [🏠 Wiki](../../index.md)\n"
});
