<template>
  <div
    class="cml-file-chip relative flex max-w-full items-center gap-2 border border-border bg-surface-container p-1.5 pr-3"
    :data-cml-theme="themeMode"
    :class="roleColorClass"
  >
    <slot
      :file="file"
      :url="thumbUrl"
      :meta="meta"
    >
      <span class="cml-file-chip-icon flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
        <img
          v-if="thumbUrl"
          :src="thumbUrl"
          :alt="file.name"
          class="h-full w-full object-cover"
        >
        <span
          v-else
          class="flex h-full w-full items-center justify-center text-white"
          :class="meta.colorClass"
        >
          <IMaterialSymbolsTableChart
            v-if="meta.kind === 'sheet'"
            class="h-5 w-5"
          />
          <IMaterialSymbolsPictureAsPdf
            v-else-if="meta.kind === 'pdf'"
            class="h-5 w-5"
          />
          <IMaterialSymbolsDescription
            v-else-if="meta.kind === 'doc'"
            class="h-5 w-5"
          />
          <IMaterialSymbolsFolderZip
            v-else-if="meta.kind === 'archive'"
            class="h-5 w-5"
          />
          <IMaterialSymbolsMusicNote
            v-else-if="meta.kind === 'audio'"
            class="h-5 w-5"
          />
          <IMaterialSymbolsMovie
            v-else-if="meta.kind === 'video'"
            class="h-5 w-5"
          />
          <IMaterialSymbolsDraft
            v-else
            class="h-5 w-5"
          />
        </span>
      </span>
      <span class="flex min-w-0 flex-col">
        <span class="max-w-[10rem] truncate text-sm font-medium text-on-surface">{{ file.name }}</span>
        <span class="text-xs tracking-wide text-on-surface-variant"><span class="uppercase">{{ meta.label }}</span> · {{ sizeText }}</span>
      </span>
    </slot>
    <button
      v-if="removable"
      type="button"
      class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface-container-highest text-on-surface shadow-sm transition-colors hover:bg-[var(--cml-color-current-color)] hover:text-[var(--cml-color-current-on-color)]"
      :aria-label="`移除 ${file.name}`"
      @click.stop="emit('remove')"
    >
      <IMaterialSymbolsCloseRounded class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  file: File
  /** 圖片縮圖 objectURL；未提供且為圖片檔時自行產生（並負責回收） */
  url?: string
  color?: CamelotColorRole
  /** 顯示右上角移除鈕（emit remove） */
  removable?: boolean
}>(), {
  url: '',
  color: 'primary',
  removable: false,
})

const emit = defineEmits<{
  remove: []
}>()

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const meta = computed(() => camelotFileMeta(props.file))
const sizeText = computed(() => camelotFormatFileSize(props.file.size))

// 外部給 url 用外部的；否則圖片檔自行產生 objectURL 並管理生命週期
const ownUrl = ref('')
watch([() => props.file, () => props.url], () => {
  if (ownUrl.value) {
    URL.revokeObjectURL(ownUrl.value)
    ownUrl.value = ''
  }
  if (!props.url && meta.value.kind === 'image') {
    ownUrl.value = URL.createObjectURL(props.file)
  }
}, { immediate: true })

const thumbUrl = computed(() => props.url || ownUrl.value)

onBeforeUnmount(() => {
  if (ownUrl.value) URL.revokeObjectURL(ownUrl.value)
})
</script>

<style scoped>
.cml-file-chip { border-radius: 0.75rem; }
.cml-file-chip[data-cml-theme="aqua"] { border-radius: 1rem; }
.cml-file-chip[data-cml-theme="scifi"] { border-radius: 0; }

.cml-file-chip-icon { border-radius: 0.5rem; }
.cml-file-chip[data-cml-theme="aqua"] .cml-file-chip-icon { border-radius: 0.625rem; }
.cml-file-chip[data-cml-theme="scifi"] .cml-file-chip-icon { border-radius: 0; }
</style>
