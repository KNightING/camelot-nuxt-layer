<template>
  <span
    class="inline-flex items-baseline font-mono tabular-nums"
    :class="[roleColorClass, sizeClass, themeClass, easeClass]"
    :aria-label="`${prefix}${formattedValue}${suffix}`"
    role="text"
  >
    <span
      v-if="prefix"
      aria-hidden="true"
    >{{ prefix }}</span>
    <!-- 字元的 key 含位置與字元本身：字元一變就重建節點，重新播放滾動進入的動畫 -->
    <span
      v-for="character in characters"
      :key="character.key"
      class="cml-number-char"
      :class="{ 'cml-number-roll': isAnimated }"
      aria-hidden="true"
    >{{ character.value }}</span>
    <span
      v-if="suffix"
      aria-hidden="true"
    >{{ suffix }}</span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 要顯示的數字；十進位字串（例如 '144.00'）會原樣交給 Intl 格式化，不經浮點運算 */
    value?: number | `${number}`
    /** 顯示在數字前面的符號，例如「$」 */
    prefix?: string
    /** 顯示在數字後面的單位 */
    suffix?: string
    /** 固定顯示的小數位數 */
    fractionDigits?: number
    /** BCP 47 語系，用來決定千分位與小數點；未指定時使用瀏覽器語系 */
    locale?: string
    size?: CamelotNumberSize
    color?: CamelotColorRole
  }>(),
  {
    value: 0,
    prefix: '',
    suffix: '',
    fractionDigits: 0,
    locale: undefined,
    size: 'lg',
    color: 'primary',
  },
)

// 格式化器建立成本高且無狀態，依語系與小數位數快取，不在每次渲染重建
const formatterCache = new Map<string, Intl.NumberFormat>()

const getFormatter = (locale: string | undefined, fractionDigits: number): Intl.NumberFormat => {
  const cacheKey = `${locale ?? ''}|${fractionDigits}`
  const cached = formatterCache.get(cacheKey)
  if (cached) return cached
  const created = new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
  formatterCache.set(cacheKey, created)
  return created
}

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

// 第一次渲染不播動畫，只有之後數值變動才播
const isAnimated = ref(false)

onMounted(() => {
  isAnimated.value = true
})

const formattedValue = computed(() => getFormatter(props.locale, props.fractionDigits).format(props.value))

const characters = computed(() =>
  Array.from(formattedValue.value, (value, index) => ({
    value,
    key: `${index}-${value}`,
  })),
)

const sizeClass = computed(() => {
  switch (props.size) {
    case 'md':
      return 'text-2xl'
    case 'xl':
      return 'text-6xl'
    default:
      return 'text-4xl'
  }
})

const themeClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'font-bold tracking-tight text-on-surface'
    case 'aqua':
      return 'font-semibold text-on-surface'
    case 'scifi':
      return 'font-bold tracking-wider text-[var(--cml-color-current-color)] [text-shadow:0_0_10px_color-mix(in_srgb,var(--cml-color-current-color)_60%,transparent)]'
    case 'cupertino':
      return 'font-semibold text-on-surface'
    default:
      return 'font-medium text-on-surface'
  }
})

const easeClass = computed(() => (themeMode.value === 'tactile' ? '[--cml-number-ease:var(--ease-tactile)]' : '[--cml-number-ease:var(--ease-spring)]'))
</script>

<style scoped>
.cml-number-char {
  display: inline-block;
  white-space: pre;
}

/* 變動的字元從下方滾進來並淡入 */
.cml-number-roll {
  animation: cml-number-roll 0.5s var(--cml-number-ease) both;
}

@keyframes cml-number-roll {
  from {
    opacity: 0;
    transform: translateY(60%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cml-number-roll { animation: none; }
}
</style>
