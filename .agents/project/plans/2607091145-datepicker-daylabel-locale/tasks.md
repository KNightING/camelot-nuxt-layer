# Tasks for 2607091145

- [x] 調查 Calendar/DateV2/DateRangeV2 現況(getDayAttributes、寫死中文週/月名、local 時間、格高 52px)
- [x] Q2:Calendar 移除固定 h-[52px]→min-h-10(內容驅動);加 `showDayLabel`(label v-if);DateV2/DateRangeV2 轉發
- [x] Q4:Calendar 加 `locale` / `weekStartsOn` / `weekdayFormatter` / `monthFormatter` / `yearFormatter`;週名/月名/年月標題改 computed(自訂fn > Intl > 預設中文);startOfWeek 帶 weekStartsOn;週名 :key 改 index
- [x] DateV2/DateRangeV2 轉發全部新 prop
- [x] playground:語系切換鈕(繁/簡/英/日/韓/泰/阿)+ 週一起始 switch + 緊湊 switch demo
- [x] 驗證(部分):語系渲染**已證實**(韓文 일월화수목금토/2026년 7월、泰文 อาทิตย์…);無 server/console 錯誤。週起始/緊湊格高因預覽 popup 合成點擊不穩無法自動量測,程式邏輯已 review,需真實瀏覽器目視確認
