<template>
  <div
    class="cml-dropzone flex w-full flex-col gap-2"
    :data-cml-theme="themeMode"
    :class="roleColorClass"
    @dragover.prevent="onDragOver"
    @dragenter.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div
      class="cml-dropzone-area flex cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed px-3 py-4 text-center text-sm transition"
      :style="{ minHeight: height }"
      :class="areaStateClass"
      @click="pick()"
    >
      <slot
        :drag-over="dragOver"
        :count="count"
        :max="maxCount"
        :at-max="atMax"
        :open="pick"
      >
        <slot name="icon">
          <IMaterialSymbolsUploadFile class="h-7 w-7 opacity-70" />
        </slot>
        <span class="leading-tight">{{ hint }}</span>
      </slot>
    </div>

    <!-- 附件晶片列：縮圖/型別色塊 + 檔名 + 型別標籤·大小 + 角落移除鈕 -->
    <div
      v-if="preview && entries.length"
      class="flex flex-wrap gap-2"
    >
      <template
        v-for="(c, i) in entries"
        :key="c.key"
      >
        <slot
          name="chip"
          :file="c.file"
          :url="c.url"
          :index="i"
          :remove="() => removeAt(i)"
        >
          <CamelotFileChip
            :file="c.file"
            :url="c.url"
            :color="color"
            removable
            @remove="removeAt(i)"
          />
        </slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: CamelotColorRole
  /** 接受的檔案型別（同 input accept）；預設不限 */
  accept?: string
  multiple?: boolean
  disabled?: boolean
  /** 最多檔數（0＝不限） */
  max?: number
  /** 拖曳區最小高度 */
  height?: string
  hint?: string
  /** 是否顯示附件晶片列 */
  preview?: boolean
}>(), {
  color: 'primary',
  accept: '*',
  multiple: true,
  disabled: false,
  max: 0,
  height: '7rem',
  hint: '點此選擇檔案，或拖曳到此區域',
  preview: true,
})

const emit = defineEmits<{
  select: [files: File[]]
}>()

const model = defineModel<File[] | null>({ default: null })

const { themeMode } = useCamelotTheme()
const roleColorClass = useCamelotRoleColorClass(() => props.color)

const {
  dragOver, count, atMax, maxCount, entries, removeAt, pick, onDragOver, onDragLeave, onDrop,
} = useCamelotFileDrop({
  model,
  accept: () => props.accept,
  multiple: () => props.multiple,
  max: () => props.max,
  disabled: () => props.disabled,
  thumbnails: () => props.preview,
  onSelect: files => emit('select', files),
})

const areaStateClass = computed(() => [
  dragOver.value
    ? 'border-[var(--cml-color-current-color)] bg-[color-mix(in_srgb,var(--cml-color-current-color)_12%,transparent)] text-[var(--cml-color-current-color)]'
    : 'border-border text-on-surface-variant hover:border-[var(--cml-color-current-color)] hover:bg-surface-container',
  { 'pointer-events-none opacity-50': props.disabled },
])
</script>

<style scoped>
/* 形狀依主題識別（同 ImageDropzone 模式） */
.cml-dropzone-area { border-radius: 0.5rem; }
.cml-dropzone[data-cml-theme="aqua"] .cml-dropzone-area { border-radius: 1rem; }
.cml-dropzone[data-cml-theme="scifi"] .cml-dropzone-area { border-radius: 0; }
.cml-dropzone[data-cml-theme="cupertino"] .cml-dropzone-area { border-radius: 0.75rem; }
</style>
