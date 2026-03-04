<template>
  <div>
    <Header>
      <template #bottom>
        <div class="w-full bg-primary h-10 z-10" />
      </template>
    </Header>
    {{ canBack() }}
    <button
      class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
      @click="toPath('/page1').to()"
    >
      to page1
    </button>
    <div class="text-primary">
      {{ useBaseUrl() }}
    </div>
    <div
      class="text-primary"
      @click="useColorMode().value = 'light'"
    >
      light
    </div>
    <div
      class="text-primary"
      @click="useColorMode().value = 'dark'"
    >
      dark
    </div>
    <button
      type="button"
      @click="useRouter().push('/dialog')"
    >
      go to dialog
    </button>

    <CamelotNumberCounter
      v-model="v"
      class="w-4"
      :max="10"
      :min="0"
      min-step-by-value
      used-min-step-by-value
    />

    <input v-model="v">

    <CamelotTabs
      v-model="tabSelected"
      class="top-0 sticky bg-surface py-2 px-2 z-10 shadow"
      :class="{
        'drop-shadow': expanded,
      }"
      :options="data"
      display-key="name"
      trigger="hover"
    />
    <CamelotInput />

    <CamelotSelectV2
      v-model="department"
      class="w-full"
    />

    <CamelotSelectV2
      v-model="department"
      :options="options"
      :options-container-max-height="250"
      options-container-class="bg-gray-100 shadow-inner"
      class="w-fit ml-4"
    >
      <!-- 自定義 Header -->
      <template #header="{ searchValue, setSearchValue }">
        <div class="bg-blue-50/50 p-3 flex flex-col gap-2 border-b border-blue-100">
          <span class="text-blue-800 font-bold text-sm flex items-center gap-1">
            <span>✨</span> 客製化專屬標題區塊
          </span>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm">🔍</span>
            <input
              :value="searchValue"
              type="text"
              placeholder="試著在這裡輸入條件..."
              class="w-full py-2 pl-9 pr-3 bg-white border border-blue-200 rounded outline-none focus:border-blue-500 text-sm shadow-sm transition-colors"
              @input="(e) => setSearchValue((e.target as HTMLInputElement).value)"
              @click.stop
            >
          </div>
        </div>
      </template>

      <!-- 自定義 Option -->
      <template #option="{ data: itemData, isSelected }">
        <div
          class="flex items-center gap-3 p-2 my-1 rounded-lg cursor-pointer transition-all w-full"
          :class="[
            isSelected ? 'bg-blue-100/50 border border-blue-200' : 'hover:bg-slate-100 border border-transparent',
          ]"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
            :class="isSelected ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'"
          >
            {{ itemData.name ? itemData.name.charAt(0) : '?' }}
          </div>
          <div class="flex flex-col">
            <span
              class="text-sm font-medium transition-colors"
              :class="isSelected ? 'text-blue-700' : 'text-slate-700'"
            >
              {{ itemData.name || itemData.label }}
            </span>
            <span class="text-xs text-slate-400">部門代號: {{ itemData.value }}</span>
          </div>
          <!-- 勾選圖標 (右靠) -->
          <div
            v-if="isSelected"
            class="ml-auto text-blue-500 px-2 shrink-0"
          >
            ✓
          </div>
        </div>
      </template>
    </CamelotSelectV2>

    <CamelotSteps
      v-model="step"
      :steps="[
        '確認商品',
        '填寫資料',
        '訂購完成',
      ]"
      enable-change-by-click
    >
      <template #dot="{ index, isComplete }">
        <div
          class="w-7 aspect-square bg-white rounded-full flex justify-center items-center"
          :class="{ 'bg-yellow-500!': isComplete }"
        >
          <span
            class=" text-red-500 "
            :class="{ 'text-blue-500!': isComplete }"
          >{{ index }}</span>
        </div>
      </template>
      <!-- <template #content="{ value,index }">
        <span class="text-red-100">{{ index }}{{ value }}</span>
      </template> -->
    </CamelotSteps>
    <div class="text-on-surface">
      {{ step }}
    </div>
    <div @click="expanded = !expanded">
      Expanded
    </div>

    <CamelotExpanded :expanded="expanded">
      <template #header>
        <div>
          Expanded
        </div>
      </template>
      <div class="bg-gradient-to-b from-red-500 to-blue-500 h-28" />
    </CamelotExpanded>

    <div class="w-40 h-60 rounded-2xl overflow-hidden ">
      <CamelotSkeleton />
    </div>

    <div class="w-40 h-40">
      <CamelotImage
        :src="url"
        class="w-full h-full object-scale-down"
      >
        <template #error>
          <span class="flex w-full h-full bg-black text-red-600">loading image error</span>
        </template>
      </CamelotImage>
    </div>

    <div class="w-40 h-40">
      <CamelotImageV2
        :src="url"
        class="w-full h-full"
        hover-show-full-image
      >
        <template #error>
          <span class="flex w-full h-full bg-black text-red-600">loading image error</span>
        </template>
      </CamelotImageV2>
    </div>

    <div class="w-40 h-40">
      <CamelotImageV2
        :src="url"
        class="w-full h-full"
        hover-show-full-image
      >
        <template #error>
          <span class="flex w-full h-full bg-black text-red-600">loading image error</span>
        </template>
      </CamelotImageV2>
    </div>

    isOnBottom: {{ isOnBottom }}

    <!-- <ClientOnly> -->
    <CamelotDate />
    <!-- </ClientOnly> -->

    <CamelotPopupV2
      class="ml-10"
    >
      <div class="text-primary">
        Open PopupV2
      </div>
      <template #popup>
        <div class="h-[100px] bg-blue-400 text-primary">
          HIHI
        </div>
      </template>
    </CamelotPopupV2>

    <CamelotPopup class="ml-10">
      <div class="text-primary">
        Open PopupV1
      </div>
      <template #popup>
        <div class="h-[100px] bg-blue-400 text-primary">
          HIHI
        </div>
      </template>
    </CamelotPopup>

    <div class="w-40 h-40">
      <CamelotImage
        src="https://123"
        class="w-full h-full object-scale-down "
      >
        <template #error>
          <span class="flex w-full h-full bg-black text-red-600">loading image error</span>
        </template>
      </CamelotImage>
    </div>

    <CamelotSelectV2
      v-model="department"
      :options="options"
    >
      <!-- <div
        class="w-full border bg-background text-black-700 border-black-300 focus:border-primary-500 outline-none rounded-lg px-4 py-2 text-base caret-primary-500 flex"
      >
        <span class="flex-1">{{ department }}</span>
      </div>

      <template #option="{ data: itemData }">
        <span class="flex-1">{{ itemData.name }}~~</span>
      </template>

      <template #option-中式餐廳>
        <span class="flex-1">中式餐~~廳</span>
      </template> -->
    </CamelotSelectV2>

    <CamelotSelectV2
      v-model="department"
      :options="options"
      :searchable="false"
      class="w-fit"
      popup-width-mode="same-target"
    >
      <div
        class="w-[200px] border bg-background text-black-700 border-black-300 focus:border-primary-500 outline-none rounded-lg px-4 py-2 text-base caret-primary-500 flex"
      >
        <span class="flex-1">{{ department }}</span>
      </div>
    </CamelotSelectV2>

    <span>向下相容</span>
    <CamelotBreakpoints>
      <template
        #default="{
          isMobile,
          isTablet,
          isLaptop,
          isDesktop,
        }"
      >
        <div class="flex flex-col gap-4 ">
          <span class="text-primary">isMobile:{{ isMobile }}</span>
          <span class="text-primary">isTablet:{{ isTablet }}</span>
          <span class="text-primary">isLaptop:{{ isLaptop }}</span>
          <span class="text-primary">isDesktop:{{ isDesktop }}</span>
        </div>
      </template>

      <template #mobile>
        mobile
      </template>

      <template #laptop>
        laptop
      </template>
    </CamelotBreakpoints>

    <CamelotBreakpoints disabled-downward>
      <template
        #default="{
          isMobile,
          isTablet,
          isLaptop,
          isDesktop,
        }"
      >
        <div class="flex flex-col gap-4">
          <span class="text-primary">isMobile:{{ isMobile }}</span>
          <span class="text-primary">isTablet:{{ isTablet }}</span>
          <span class="text-primary">isLaptop:{{ isLaptop }}</span>
          <span class="text-c-test">isDesktop:{{ isDesktop }}</span>
        </div>
      </template>

      <template #mobile>
        mobile
      </template>

      <template #laptop>
        laptop
      </template>
    </CamelotBreakpoints>
  </div>
</template>

<script setup lang="ts">
const { toPath, canBack } = useCamelotRouter()
const loading = useLoading()

const { isOnBottom } = useScrollOnBottom()
// useInfinitePage({
//   nextPage: () => {
//     const newDiv = document.createElement('div')
//     newDiv.style.height = '1000px'
//     document.documentElement.appendChild(newDiv)
//   },
//   isPending: isPending,
// })

const step = ref(0)
const expanded = ref(false)

const v = ref(0.3)

const globalColorScheme = useCustomColorScheme<{ test: string }>(undefined, {
  lightColorScheme: {
    test: '#F40fFF',
  },
  darkColorScheme: {
    primary: '#12FF00',
    test: '#140fF1',
  },
})

const elLightColorScheme = ref<Material3ColorSchemePartial>({
  primary: 'yellow',
})

const data
  = Array.from({ length: 21 }).map((_, rowIndex) => {
    return {
      name: `分類-${rowIndex}`,
      value: rowIndex,
    }
  })

const tabSelected = ref(0)

const department = ref('韓式餐廳')

const { url } = useRandomCatImg()

const options = ref([
  {
    name: '韓式餐廳',
    value: '韓式餐廳',
  },
  {
    name: '港式餐廳',
    value: '港式餐廳',
  },
  {
    name: '日式餐廳',
    value: '日式餐廳',
  },
  {
    name: '中式餐廳',
    value: '中式餐廳',
  },
])
</script>

<style scoped></style>
