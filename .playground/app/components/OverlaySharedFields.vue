<template>
  <div class="flex flex-col gap-4">
    <p class="text-xs opacity-70">
      這兩個控制項在 Dialog 與 Sheet 中綁定同一組 state，任一側修改另一側即時反映。
    </p>

    <div class="flex items-center justify-between gap-4">
      <span class="text-sm">Shared count</span>
      <CamelotNumberCounter
        v-model="count"
        :max="10"
        :min="0"
      />
    </div>

    <CamelotSelectV2
      v-model="option"
      label="Shared option"
      :options="options"
      class="w-full"
    />

    <!--
      以下為浮層檢查點：驗證各種浮層在 Dialog / Sheet 內是否可用
      （不被誤判為點遮罩、不被面板蓋住、定位正確）。
      這些範例刻意全部使用元件預設值，不傳任何迴避用的 prop。
    -->
    <div class="flex flex-col gap-3 border-t border-outline-variant/40 pt-3">
      <span class="text-xs font-semibold uppercase tracking-wider opacity-60">
        浮層檢查點
      </span>
      <p class="text-xs opacity-70">
        驗證各種浮層在 Dialog / Sheet 內是否可用。
        <strong class="text-error">已知失效</strong>：時間欄位的內層時分秒清單與階層選單目前以
        <code>Teleport to="body"</code> 實作，會落在 <code>&lt;dialog&gt;</code> 的 top layer
        之下而看不見；待改以 <code>PopupV2</code> 為基底後修復。
      </p>

      <CamelotDateV2
        v-model="date"
        label="日期（popup 模式）"
        placeholder="請選擇日期"
        show-type="popup"
      />

      <CamelotDateV2
        v-model="dateInNestedDialog"
        label="日期（dialog 模式・巢狀 dialog）"
        placeholder="請選擇日期"
        show-type="dialog"
      />

      <CamelotTimeV2
        v-model="time"
        label="時間（內層時分秒選單）"
      />

      <div class="flex flex-wrap items-center gap-3">
        <CamelotPopupV2>
          <CamelotButton
            is-container
            label="原生 Popup"
          />
          <template #popup>
            <div class="flex flex-col gap-2 rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface shadow-lg">
              <span>選項一</span>
              <span>選項二</span>
              <span>選項三</span>
            </div>
          </template>
        </CamelotPopupV2>

        <CamelotCascadeMenu :items="cascadeItems">
          <CamelotButton
            is-container
            label="階層選單 ▾"
          />
        </CamelotCascadeMenu>
      </div>
    </div>

    <p class="text-xs">
      目前值：<span class="text-c-test font-semibold">{{ count }} ・ {{ option }}</span>
      <br>
      <span class="opacity-70">
        上方數值以自訂鍵 <code>test</code> 上色，按鈕與強調色用被覆寫的 <code>primary</code>，
        背景與文字則繼承全域主題。
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  options: { name: string, value: string, label: string }[]
}>()

const count = defineModel<number>('count', { required: true })
const option = defineModel<string>('option', { required: true })

// 浮層檢查點用的本地狀態；不納入 Dialog / Sheet 的共通值，避免混淆兩件事的展示重點
const date = ref<Date | undefined>()
const dateInNestedDialog = ref<Date | undefined>()
const time = ref<string>('')

const cascadeItems: CamelotCascadeMenuItem[] = [
  {
    label: '外觀',
    value: 'appearance',
    children: [
      {
        label: '淺色',
        value: 'light',
      },
      {
        label: '深色',
        value: 'dark',
      },
    ],
  },
  {
    label: '語言',
    value: 'language',
    children: [
      {
        label: '繁體中文',
        value: 'zh-Hant',
      },
      {
        label: 'English',
        value: 'en',
      },
    ],
  },
  {
    label: '關於',
    value: 'about',
  },
]
</script>
