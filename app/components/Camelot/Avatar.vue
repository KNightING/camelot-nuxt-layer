<template>
  <span
    class="inline-flex shrink-0 items-center justify-center overflow-hidden font-bold text-[var(--cml-color-current-on-color)] select-none"
    :class="[roleColorClass, sizeClass, themeClass]"
    :title="name"
  >
    <img
      v-if="isImageShown"
      class="h-full w-full object-cover"
      :src="src"
      :alt="name"
      @error="hasImageError = true"
    >
    <slot v-else>{{ initials }}</slot>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** 姓名：圖片的替代文字，沒有圖片時顯示其縮寫 */
    name?: string
    /** 頭像圖片網址；載入失敗會退回顯示縮寫 */
    src?: string
    size?: CamelotAvatarSize
    color?: CamelotColorRole
  }>(),
  {
    name: '',
    src: '',
    size: 'md',
    color: 'primary',
  },
)

// 拉丁字母取前兩個字元、其餘（中日韓等）取第一個字，避免兩個全形字塞不進小尺寸頭像
const LATIN_INITIALS_LENGTH = 2
const WIDE_INITIALS_LENGTH = 1
const LATIN_NAME_PATTERN = /^[ -ɏ]+$/

const { themeMode } = useCamelotTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.color)

const hasImageError = ref(false)

const isImageShown = computed(() => props.src !== '' && !hasImageError.value)

const initials = computed(() => {
  const trimmedName = props.name.trim()
  const length = LATIN_NAME_PATTERN.test(trimmedName) ? LATIN_INITIALS_LENGTH : WIDE_INITIALS_LENGTH
  return trimmedName.slice(0, length).toUpperCase()
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 w-8 text-xs'
    case 'lg':
      return 'h-14 w-14 text-lg'
    default:
      return 'h-10.5 w-10.5 text-sm'
  }
})

const themeClass = computed(() => {
  switch (themeMode.value) {
    case 'tactile':
      return 'rounded-full tactile-fill'
    case 'aqua':
      return 'rounded-full aqua-fill [--cml-aqua-fill-gloss:transparent]'
    case 'scifi':
      return 'rounded-none bg-[color-mix(in_srgb,var(--cml-color-current-color)_85%,transparent)] font-mono shadow-[0_0_8px_color-mix(in_srgb,var(--cml-color-current-color)_60%,transparent)] [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]'
    default:
      return 'rounded-full bg-[var(--cml-color-current-color)]'
  }
})

// src 換了就重新嘗試載入
watch(() => props.src, () => {
  hasImageError.value = false
})
</script>
