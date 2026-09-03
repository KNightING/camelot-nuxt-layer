<template>
  <div class="flex flex-col gap-6">
    <p class="text-xs opacity-70">
      這些控制項全部放在 Drawer 內部，用來驗證各種浮層在 Drawer 之上是否可見、可操作：
      Drawer 面板本身在 <code>--cml-z-drawer</code> 層，浮層則在 <code>--cml-z-popup</code>，
      兩者都 teleport 到 <code>body</code>，因此純比 z-index 大小。
      全部使用元件預設值，不傳任何迴避用的 prop——一旦有回歸，這裡就會直接壞給你看。
    </p>

    <!-- Select：最容易被面板蓋住的一個 -->
    <section class="flex flex-col gap-3">
      <span class="text-xs font-semibold uppercase tracking-wider opacity-60">
        Select（下拉選單）
      </span>
      <CamelotSelectV2
        v-model="option"
        label="Select（預設層級）"
        :options="options"
        class="w-full max-w-sm"
      />
      <CamelotSelectV2
        v-model="virtualOption"
        label="Select（虛擬捲動・長清單）"
        :options="longOptions"
        virtual-scroll
        class="w-full max-w-sm"
      />
    </section>

    <!-- Popup 系列 -->
    <section class="flex flex-col gap-3 border-t border-outline-variant/40 pt-4">
      <span class="text-xs font-semibold uppercase tracking-wider opacity-60">
        Popup（浮層）
      </span>
      <div class="flex flex-wrap items-center gap-3">
        <CamelotPopupV2>
          <CamelotButton
            :color="color"
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
            :color="color"
            is-container
            label="階層選單 ▾"
          />
        </CamelotCascadeMenu>
      </div>

      <CamelotDateV2
        v-model="date"
        label="日期（popup 模式）"
        placeholder="請選擇日期"
        show-type="popup"
        class="w-full max-w-sm"
      />

      <CamelotTimeV2
        v-model="time"
        label="時間（內層時分秒選單）"
        class="w-full max-w-sm"
      />
    </section>

    <!-- Dialog / Sheet：從 Drawer 內部再疊一層 -->
    <section class="flex flex-col gap-3 border-t border-outline-variant/40 pt-4">
      <span class="text-xs font-semibold uppercase tracking-wider opacity-60">
        Dialog / Sheet（從 Drawer 內部再疊一層）
      </span>
      <p class="text-xs opacity-70">
        原生 <code>&lt;dialog&gt;</code> 走 top layer，永遠蓋過 Drawer；重點是 Dialog / Sheet 內的
        Select 也要能正常展開（浮層會 teleport 進該 dialog）。
      </p>
      <div class="flex flex-wrap gap-3">
        <CamelotButton
          :color="color"
          label="Open Dialog"
          @click="dialogOpen = true"
        />
        <CamelotButton
          :color="color"
          label="Open Sheet"
          @click="sheetOpen = true"
        />
      </div>

      <CamelotDateV2
        v-model="dateInDialog"
        label="日期（dialog 模式）"
        placeholder="請選擇日期"
        show-type="dialog"
        class="w-full max-w-sm"
      />
    </section>

    <!-- 多層 Drawer：從 Drawer 內部再開 Drawer -->
    <section class="flex flex-col gap-3 border-t border-outline-variant/40 pt-4">
      <span class="text-xs font-semibold uppercase tracking-wider opacity-60">
        多層 Drawer（從 Drawer 再開 Drawer）
      </span>
      <p class="text-xs opacity-70">
        每一層都用元件預設值，因此共用同一個 <code>--cml-z-drawer</code> 刻度；
        相同 z-index 時由 DOM 順序決定先後，而子層 Drawer 的 Teleport 容器一定晚於父層插入 body，
        所以會疊在父層之上。裡面同樣放了浮層啟動點，用來確認深層 Drawer 內的 Select / Sheet 依然正常。
      </p>
      <div class="flex flex-wrap gap-3">
        <CamelotButton
          :color="color"
          label="Open Nested Drawer (L2)"
          @click="nestedDrawerOpen = true"
        />
      </div>
    </section>

    <CamelotDrawer
      v-model:open="nestedDrawerOpen"
      position="right"
      width="480px"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4 border-b border-outline-variant/40 px-5 py-4">
          <h3 class="text-base font-bold">
            Nested Drawer・L2
          </h3>
          <CamelotButton
            :color="color"
            is-container
            label="關閉"
            @click="nestedDrawerOpen = false"
          />
        </div>
      </template>

      <div class="flex flex-col gap-4 px-5 py-4">
        <p class="text-xs opacity-70">
          第二層 Drawer，從第一層的內容開啟。
        </p>
        <CamelotSelectV2
          v-model="optionInNested"
          label="L2 的 Select"
          :options="options"
          class="w-full"
        />
        <CamelotButton
          :color="color"
          label="Open Sheet in L2"
          @click="nestedSheetOpen = true"
        />
        <CamelotButton
          :color="color"
          is-container
          label="Open Drawer (L3)"
          @click="nestedDrawerL3Open = true"
        />
      </div>
    </CamelotDrawer>

    <CamelotDrawer
      v-model:open="nestedDrawerL3Open"
      position="left"
      width="360px"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4 border-b border-outline-variant/40 px-5 py-4">
          <h3 class="text-base font-bold">
            Nested Drawer・L3
          </h3>
          <CamelotButton
            :color="color"
            is-container
            label="關閉"
            @click="nestedDrawerL3Open = false"
          />
        </div>
      </template>

      <div class="flex flex-col gap-4 px-5 py-4">
        <p class="text-xs opacity-70">
          第三層。確認多層堆疊後遮罩、Esc 關閉與浮層都仍對應到正確的那一層。
        </p>
        <CamelotSelectV2
          v-model="optionInNestedL3"
          label="L3 的 Select"
          :options="options"
          class="w-full"
        />
      </div>
    </CamelotDrawer>

    <CamelotBaseBottomSheetV2
      v-model:open="nestedSheetOpen"
      tag="nested-drawer-sheet"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <h3 class="text-lg font-bold">
            Sheet from L2 Drawer
          </h3>
          <CamelotButton
            is-container
            label="關閉"
            @click="nestedSheetOpen = false"
          />
        </div>
        <CamelotSelectV2
          v-model="optionInNestedSheet"
          label="Sheet 內的 Select"
          :options="options"
          class="w-full"
        />
      </div>
    </CamelotBaseBottomSheetV2>

    <p class="text-xs opacity-70">
      目前值：
      <span class="font-semibold">{{ option }} ・ {{ virtualOption || '—' }} ・ {{ time || '—' }}</span>
    </p>

    <CamelotBaseDialogV2 v-model:open="dialogOpen">
      <div class="flex flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <h3 class="text-lg font-bold">
            Dialog in Drawer
          </h3>
          <CamelotButton
            is-container
            label="關閉"
            @click="dialogOpen = false"
          />
        </div>
        <CamelotSelectV2
          v-model="optionInDialog"
          label="Dialog 內的 Select"
          :options="options"
          class="w-full"
        />
      </div>
    </CamelotBaseDialogV2>

    <CamelotBaseBottomSheetV2
      v-model:open="sheetOpen"
      tag="drawer-sheet"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <h3 class="text-lg font-bold">
            Sheet in Drawer
          </h3>
          <CamelotButton
            is-container
            label="關閉"
            @click="sheetOpen = false"
          />
        </div>
        <CamelotSelectV2
          v-model="optionInSheet"
          label="Sheet 內的 Select"
          :options="options"
          class="w-full"
        />
      </div>
    </CamelotBaseBottomSheetV2>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    options: { name: string, value: string, label: string }[]
    color?: CamelotColorRole
  }>(),
  {
    color: 'primary',
  },
)

const option = defineModel<string>('option', { required: true })

const virtualOption = ref('')
const optionInDialog = ref('')
const optionInSheet = ref('')
const date = ref<Date | undefined>()
const dateInDialog = ref<Date | undefined>()
const time = ref<string>('')

const dialogOpen = ref(false)
const sheetOpen = ref(false)

// 多層 Drawer：從 Drawer 內部再開 Drawer
const nestedDrawerOpen = ref(false)
const nestedDrawerL3Open = ref(false)
const nestedSheetOpen = ref(false)
const optionInNested = ref('')
const optionInNestedL3 = ref('')
const optionInNestedSheet = ref('')

const longOptions = Array.from({ length: 200 }).map((_, i) => ({
  name: `選項 ${i + 1}`,
  value: `option-${i + 1}`,
  label: `選項 ${i + 1}`,
}))

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
