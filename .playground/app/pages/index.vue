<template>
  <div>
    <!--置頂 Header -->
    <Header>
      <template #bottom>
        <div class="w-full bg-primary h-10 z-10" />
      </template>
    </Header>

    <!-- Beautiful Theme Selector & Demo section (放置於 Header 下方，加上 pt-4 避免重疊) -->
    <div class="p-6 pt-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-6">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Camelot UI Style System Demo</h1>
      
      <!-- Theme and Color Selectors -->
      <div class="flex flex-wrap gap-6 items-center">
        <!-- Style Switcher -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Style Theme</span>
          <div class="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg gap-1 w-fit">
            <button 
              type="button" 
              class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
              :class="themeMode === 'material' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'"
              @click="themeMode = 'material'"
            >
              Material 3
            </button>
            <button 
              type="button" 
              class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
              :class="themeMode === 'cupertino' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'"
              @click="themeMode = 'cupertino'"
            >
              Cupertino
            </button>
            <button 
              type="button" 
              class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
              :class="themeMode === 'scifi' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'"
              @click="themeMode = 'scifi'"
            >
              Sci-Fi HUD
            </button>
          </div>
        </div>
        
        <!-- Dark/Light Mode Switcher -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dark / Light Mode</span>
          <div class="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg gap-1 w-fit">
            <button 
              type="button" 
              class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
              :class="colorMode === 'light' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'"
              @click="colorMode = 'light'"
            >
              Light
            </button>
            <button 
              type="button" 
              class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
              :class="colorMode === 'dark' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'"
              @click="colorMode = 'dark'"
            >
              Dark
            </button>
            <button 
              type="button" 
              class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
              :class="colorMode === 'auto' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'"
              @click="colorMode = 'auto'"
            >
              System
            </button>
          </div>
        </div>

        <!-- Color Swatches -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Color Palette Role (Component prop)</span>
          <div class="flex gap-2">
            <button 
              v-for="c in (['primary', 'secondary', 'tertiary', 'error', 'warning', 'success'] as const)"
              :key="c"
              type="button"
              class="px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all border cursor-pointer"
              :class="currentColorRole === c ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200' : 'bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
              @click="currentColorRole = c"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <!-- Global Brand Color Swatches -->
        <div class="flex flex-col gap-2">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Global Brand Color (CSS Variable)</span>
          <div class="flex gap-2 flex-wrap">
            <button 
              v-for="brand in brandColors"
              :key="brand.name"
              type="button"
              class="px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all border cursor-pointer flex items-center gap-1.5"
              :class="activeBrandColorName === brand.name ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200' : 'bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
              @click="changeBrandColor(brand)"
            >
              <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: brand.roles.primary.light }" />
              {{ brand.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Component Showcase -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <!-- Button & Switch & Checkbox Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">Basic Inputs & Controls</h2>
          
          <div class="flex items-center gap-4 flex-wrap">
            <CamelotButton :color="currentColorRole" label="Action" />
            <CamelotButton :color="currentColorRole" label="Container" is-container />
            <CamelotButton :color="currentColorRole" label="Disabled" disabled />
          </div>

          <div class="flex items-center gap-6 mt-2">
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">Switch:</span>
              <CamelotSwitch v-model="switchVal" :color="currentColorRole" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">Disabled:</span>
              <CamelotSwitch :model-value="true" disabled :color="currentColorRole" />
            </div>
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <CamelotCheckbox v-model="checkboxVal" label="Agree to terms" :color="currentColorRole" />
            <CamelotCheckbox :model-value="true" label="Disabled Checkbox" disabled :color="currentColorRole" />
          </div>
        </div>

        <!-- Inputs and Select Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">Form Inputs & Fields</h2>
          
          <CamelotInput 
            v-model="inputTextVal" 
            label="Username" 
            placeholder="Enter your username..." 
            :color="currentColorRole"
          />

          <CamelotSelectV2 
            v-model="selectVal" 
            label="Choose option" 
            :options="options" 
            :color="currentColorRole"
          />
        </div>

        <!-- SelectV2 Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">Searchable Selection</h2>
          
          <CamelotSelectV2 
            v-model="selectV2Val" 
            label="Searchable selection" 
            :options="options" 
            :color="currentColorRole"
            class="w-full"
          />
          
          <div class="text-xs text-slate-400 mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            Selected values: <br/>
            Text: {{ inputTextVal }} <br/>
            Dropdown: {{ selectVal }} <br/>
            Search Select: {{ selectV2Val }} <br/>
            Switch: {{ switchVal }} <br/>
            Checkbox: {{ checkboxVal }}
          </div>
        </div>

        <!-- Dialog & Bottom Sheet Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">Overlays (Dialog & Sheet)</h2>
          <p class="text-xs text-slate-400">Backdrop filters, curved corners, and clip-path structures change dynamically.</p>
          <div class="flex gap-4">
            <CamelotButton :color="currentColorRole" label="Open Dialog" @click="demoDialogOpen = true" />
            <CamelotButton :color="currentColorRole" label="Open Sheet" @click="demoSheetOpen = true" />
          </div>
        </div>

        <!-- Tabs & Steps Card -->
        <div :class="[cardClass, 'col-span-1 md:col-span-2']">
          <h2 :class="cardTitleClass">Navigation (Tabs & Steps)</h2>
          
          <div class="flex flex-col gap-2">
            <span class="text-xs text-slate-400">Themed Tabs Bar:</span>
            <CamelotTabs v-model="demoActiveTab" :options="demoTabsOptions" />
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <span class="text-xs text-slate-400">Themed Steps tracker:</span>
            <CamelotSteps v-model="demoActiveStep" :steps="demoStepsList" enable-change-by-click />
          </div>
        </div>

        <!-- Feedbacks, Skeletons & Spinner Card -->
        <div :class="cardClass">
          <h2 :class="cardTitleClass">Loaders & Toast Feedback</h2>
          <div class="flex gap-4">
            <CamelotButton :color="currentColorRole" label="Run Loader" @click="triggerLoading" />
            <CamelotButton :color="currentColorRole" label="Show Toast" @click="triggerToast" />
          </div>

          <div class="flex flex-col gap-2 mt-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400">Skeleton Loader:</span>
              <button 
                type="button" 
                class="text-xs text-slate-500 hover:text-primary underline cursor-pointer"
                @click="demoSkeletonLoading = !demoSkeletonLoading"
              >
                Toggle ({{ demoSkeletonLoading ? 'Loading' : 'Static' }})
              </button>
            </div>
            
            <div class="w-full h-16 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 p-2 flex items-center gap-3">
              <CamelotSkeleton :is-loading="demoSkeletonLoading" class="w-10 h-10 rounded-full shrink-0" />
              <div class="flex-1 flex flex-col gap-1.5 h-full justify-center">
                <CamelotSkeleton :is-loading="demoSkeletonLoading" class="w-3/4 h-3.5 rounded" />
                <CamelotSkeleton :is-loading="demoSkeletonLoading" class="w-1/2 h-3 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Demo dialog overlays -->
      <CamelotBaseDialogV2 v-model:open="demoDialogOpen" :close-by-mask="true">
        <div class="flex flex-col items-center gap-4">
          <h3 class="text-lg font-bold">Themed Modal Dialog</h3>
          <p class="text-sm opacity-80 text-center">This dialog utilizes M3 card parameters, Cupertino frosted blur, or Sci-Fi clip-paths depending on the theme!</p>
          <CamelotButton :color="currentColorRole" label="Close Dialog" @click="demoDialogOpen = false" />
        </div>
      </CamelotBaseDialogV2>

      <CamelotBaseBottomSheetV2 v-model:open="demoSheetOpen">
        <div class="flex flex-col gap-4 p-4 min-w-[300px]">
          <h3 class="text-lg font-bold text-center">Themed Bottom Sheet</h3>
          <p class="text-sm opacity-80 text-center">Handles pull-up offsets, smooth slide-up actions, and border frame customizations dynamically.</p>
          <CamelotButton :color="currentColorRole" label="Dismiss" @click="demoSheetOpen = false" class="mx-auto" />
        </div>
      </CamelotBaseBottomSheetV2>
    </div>

    <!-- Legacy / Extended components test section -->
    <div class="p-6">
      {{ canBack() }}
      <button
        class="text-blue-700 bg-blue-200 border border-blue-700 rounded-2xl p-2"
        @click="toPath('/page/1').to()"
      >
        to page1
      </button>
      <div class="text-primary">
        {{ useBaseUrl() }}
      </div>
      <div
        class="text-primary cursor-pointer"
        @click="useColorMode().value = 'light'"
      >
        light
      </div>
      <div
        class="text-primary cursor-pointer"
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
        v-model="virtualValue"
        :options="largeOptionsForVirtual"
        virtual-scroll
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
        <template #header="{ searchValue: sVal, setSearchValue: setSVal }">
          <div class="bg-blue-50/50 p-3 flex flex-col gap-2 border-b border-blue-100">
            <span class="text-blue-800 font-bold text-sm flex items-center gap-1">
              <span>✨</span> 客製化專屬標題區塊
            </span>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm">🔍</span>
              <input
                :value="sVal"
                type="text"
                placeholder="試著在這裡輸入條件..."
                class="w-full py-2 pl-9 pr-3 bg-white border border-blue-200 rounded outline-none focus:border-blue-500 text-sm shadow-sm transition-colors"
                @input="(e) => setSVal((e.target as HTMLInputElement).value)"
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
      </CamelotSteps>
      <div class="text-on-surface">
        {{ step }}
      </div>
      <div class="cursor-pointer" @click="expanded = !expanded">
        Expanded
      </div>

      <CamelotExpanded :expanded="expanded">
        <template #header>
          <div>
            Expanded
          </div>
        </template>
        <div class="bg-linear-to-b from-red-500 to-blue-500 h-28" />
      </CamelotExpanded>

      <div class="w-40 h-60 rounded-2xl overflow-hidden ">
        <CamelotSkeleton />
      </div>

      <div class="w-40 h-40">
        <CamelotImageV2
          :src="url"
          class="w-full h-full object-scale-down"
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

      <CamelotDateV2
        placeholder="請選擇日期"
        :get-day-attributes="getDayAttributes"
      />
      <CamelotDateRangeV2
        :multi-calendars="true"
        :get-day-attributes="getDayAttributes"
      />

      <CamelotPopupV2
        class="ml-10"
      >
        <div class="text-primary">
          Open PopupV2
        </div>
        <template #popup>
          <div class=" flex flex-col border border-outline-variant min-w-[205px] rounded-lg bg-surface gap-6 py-3 px-4 overflow-hidden">
            <span
              type="content1"
              single-line
            >
              客戶資料
            </span>
            <span type="content1">
              我的最愛
            </span>
            <span type="content1">
              登出
            </span>
          </div>
        </template>
      </CamelotPopupV2>

      <CamelotPopupV2 class="ml-10">
        <div class="text-primary">
          Open PopupV2 (Fallback)
        </div>
        <template #popup>
          <div class="h-[100px] bg-blue-400 text-primary">
            HIHI
          </div>
        </template>
      </CamelotPopupV2>

      <div class="w-40 h-40">
        <CamelotImageV2
          src="https://123"
          class="w-full h-full object-scale-down "
        >
          <template #error>
            <span class="flex w-full h-full bg-black text-red-600">loading image error</span>
          </template>
        </CamelotImageV2>
      </div>

      <CamelotSelectV2
        v-model="department"
        :options="options"
      />

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
  </div>
</template>

<script setup lang="ts">
import { isToday } from 'date-fns'

const getDayAttributes = (date: Date) => {
  if (isToday(date)) {
    return { label: '行憲紀念日' }
  }
}

const {
  toPath, canBack,
} = useCamelotRouter()
const loading = useLoading()

const { isOnBottom } = useScrollOnBottom()

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
    label: '韓式餐廳',
  },
  {
    name: '港式餐廳',
    value: '港式餐廳',
    label: '港式餐廳',
  },
  {
    name: '日式餐廳',
    value: '日式餐廳',
    label: '日式餐廳',
  },
  {
    name: '中式餐廳',
    value: '中式餐廳',
    label: '中式餐廳',
  },
])

const virtualValue = ref('')

const largeOptionsForVirtual = ref(
  Array.from({ length: 500 }).map((_, i) => ({
    name: `選項 ${i + 1}`,
    value: `option-${i + 1}`,
    label: `選項 ${i + 1}`,
  })),
)

// Demo specific state
const { themeMode, colorMode, setPrimaryColor, setThemeColor } = useCamelotTheme()
const currentColorRole = ref<'primary' | 'secondary' | 'tertiary' | 'error' | 'info' | 'warning' | 'success'>('primary')
const switchVal = ref(false)
const checkboxVal = ref(false)
const inputTextVal = ref('')
const selectVal = ref('韓式餐廳')
const selectV2Val = ref('港式餐廳')

const demoDialogOpen = ref(false)
const demoSheetOpen = ref(false)
const demoStepsList = ref(['Init', 'Verify', 'Deploy', 'Success'])
const demoActiveStep = ref(1)
const demoTabsOptions = ref([
  { name: 'Dashboard', value: 'dash' },
  { name: 'Analytics', value: 'analytics' },
  { name: 'System Settings', value: 'settings' }
])
const demoActiveTab = ref('dash')
const demoSkeletonLoading = ref(true)

const cardClass = computed(() => {
  if (themeMode.value === 'scifi') {
    return 'p-6 bg-slate-950/60 border border-primary/25 relative font-mono text-primary shadow-[inset_0_0_15px_rgba(0,240,255,0.05)] transition-all flex flex-col gap-4'
  } else if (themeMode.value === 'cupertino') {
    return 'p-6 bg-slate-100/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/20 dark:border-black/30 shadow-md text-slate-800 dark:text-slate-100 transition-all flex flex-col gap-4'
  } else {
    return 'p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all flex flex-col gap-4'
  }
})

const cardTitleClass = computed(() => {
  if (themeMode.value === 'scifi') {
    return 'text-lg font-bold tracking-wider text-primary border-b border-primary/20 pb-1.5'
  } else if (themeMode.value === 'cupertino') {
    return 'text-lg font-semibold text-slate-800 dark:text-slate-100'
  } else {
    return 'text-lg font-semibold text-slate-800 dark:text-white'
  }
})

const triggerToast = () => {
  useCamelotToast().open('Global Toast active in ' + themeMode.value + ' style theme!')
}

const triggerLoading = async () => {
  const close = useLoading().open('Loading theme presets...')
  await useDelay(2500)
  close()
}

const brandColors = [
  {
    name: 'Blue',
    roles: {
      primary: { light: '#0061a4', dark: '#9ecaFF' },
      onPrimary: { light: '#ffffff', dark: '#003258' },
      secondary: { light: '#008bb0', dark: '#80e2ff' },
      onSecondary: { light: '#ffffff', dark: '#003544' },
      tertiary: { light: '#9c27b0', dark: '#f3c2ff' },
      onTertiary: { light: '#ffffff', dark: '#570068' },
      error: { light: '#ba1a1a', dark: '#ffb4ab' },
      onError: { light: '#ffffff', dark: '#690005' },
      warning: { light: '#e68500', dark: '#ffbe6b' },
      onWarning: { light: '#ffffff', dark: '#4b2800' },
      success: { light: '#00875a', dark: '#63e6be' },
      onSuccess: { light: '#ffffff', dark: '#003822' }
    }
  },
  {
    name: 'Emerald',
    roles: {
      primary: { light: '#00875a', dark: '#63e6be' },
      onPrimary: { light: '#ffffff', dark: '#003822' },
      secondary: { light: '#009688', dark: '#80cbc4' },
      onSecondary: { light: '#ffffff', dark: '#003731' },
      tertiary: { light: '#689f38', dark: '#c5e1a5' },
      onTertiary: { light: '#ffffff', dark: '#243a00' },
      error: { light: '#ba1a1a', dark: '#ffb4ab' },
      onError: { light: '#ffffff', dark: '#690005' },
      warning: { light: '#f57c00', dark: '#ffb74d' },
      onWarning: { light: '#ffffff', dark: '#4d2000' },
      success: { light: '#009624', dark: '#81c784' },
      onSuccess: { light: '#ffffff', dark: '#003308' }
    }
  },
  {
    name: 'Violet',
    roles: {
      primary: { light: '#6750a4', dark: '#d0bcff' },
      onPrimary: { light: '#ffffff', dark: '#381e72' },
      secondary: { light: '#ab47bc', dark: '#ea80fc' },
      onSecondary: { light: '#ffffff', dark: '#5c007a' },
      tertiary: { light: '#e91e63', dark: '#ff80ab' },
      onTertiary: { light: '#ffffff', dark: '#5f002b' },
      error: { light: '#ba1a1a', dark: '#ffb4ab' },
      onError: { light: '#ffffff', dark: '#690005' },
      warning: { light: '#ffa000', dark: '#ffe082' },
      onWarning: { light: '#ffffff', dark: '#4c2d00' },
      success: { light: '#00875a', dark: '#63e6be' },
      onSuccess: { light: '#ffffff', dark: '#003822' }
    }
  },
  {
    name: 'Rose',
    roles: {
      primary: { light: '#ba1a1a', dark: '#ffb4ab' },
      onPrimary: { light: '#ffffff', dark: '#690005' },
      secondary: { light: '#e91e63', dark: '#ff80ab' },
      onSecondary: { light: '#ffffff', dark: '#5f002b' },
      tertiary: { light: '#e65100', dark: '#ffb74d' },
      onTertiary: { light: '#ffffff', dark: '#4d1c00' },
      error: { light: '#e01919', dark: '#ffb3b3' },
      onError: { light: '#ffffff', dark: '#680003' },
      warning: { light: '#f57c00', dark: '#ffb74d' },
      onWarning: { light: '#ffffff', dark: '#4d2000' },
      success: { light: '#00875a', dark: '#63e6be' },
      onSuccess: { light: '#ffffff', dark: '#003822' }
    }
  },
  {
    name: 'Amber',
    roles: {
      primary: { light: '#8b5000', dark: '#ffb85d' },
      onPrimary: { light: '#ffffff', dark: '#4b2800' },
      secondary: { light: '#f57c00', dark: '#ffb74d' },
      onSecondary: { light: '#ffffff', dark: '#4d2000' },
      tertiary: { light: '#558b2f', dark: '#aeec88' },
      onTertiary: { light: '#ffffff', dark: '#1b3b00' },
      error: { light: '#ba1a1a', dark: '#ffb4ab' },
      onError: { light: '#ffffff', dark: '#690005' },
      warning: { light: '#ff6f00', dark: '#ffe082' },
      onWarning: { light: '#ffffff', dark: '#4c2d00' },
      success: { light: '#00875a', dark: '#63e6be' },
      onSuccess: { light: '#ffffff', dark: '#003822' }
    }
  }
]

const activeBrandColorName = ref('Blue')

const changeBrandColor = (brand: typeof brandColors[0]) => {
  activeBrandColorName.value = brand.name
  Object.entries(brand.roles).forEach(([role, colors]) => {
    setThemeColor(role, colors.light, colors.dark)
  })
}
</script>

<style scoped></style>
