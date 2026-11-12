<template>
  <div
    class="cml-scheduler-event group flex min-w-0 select-none overflow-hidden px-1.5 text-xs outline-none focus-visible:tactile-ring"
    :class="[
      roleColorClass,
      eventClass,
      {
        [draftClass]: isDraft,
        [lockedClass]: event.locked,
        'cursor-grab': !event.locked && !readonly,
        'cursor-pointer': event.locked || readonly,
        'flex-col justify-start py-1': variant === 'block',
        'items-center gap-1 py-0.5': variant === 'chip',
      },
    ]"
    :data-event-id="event.id"
    role="button"
    tabindex="0"
    :aria-label="ariaLabel"
    @pointerdown.stop="emit('move-start', $event)"
    @keydown.enter.prevent="emit('open')"
    @keydown.space.prevent="emit('open')"
  >
    <span
      v-if="variant === 'chip'"
      class="shrink-0 font-semibold tabular-nums"
    >{{ startTime }}</span>
    <span class="min-w-0 truncate font-semibold">{{ displayTitle }}</span>
    <span
      v-if="variant === 'block'"
      class="truncate tabular-nums opacity-80"
    >{{ startTime }} – {{ endTime }}</span>

    <!-- 調整長度的把手：時間軸事件的下緣（block）或右緣（right） -->
    <span
      v-if="resizable && !event.locked && !readonly"
      class="absolute z-[1] touch-none"
      :class="{
        'inset-x-0 bottom-0 h-2 cursor-ns-resize': resizable === 'bottom',
        'inset-y-0 right-0 w-2 cursor-ew-resize': resizable === 'right',
      }"
      data-resize-handle
      aria-hidden="true"
      @pointerdown.stop="emit('resize-start', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const props = withDefaults(
  defineProps<{
    event: CamelotSchedulerEvent
    /** block 是時間軸上的色塊（標題加時間範圍）；chip 是日期格裡的單行條 */
    variant?: 'block' | 'chip'
    /** 調整長度的把手位置；不給就沒有把手 */
    resizable?: 'bottom' | 'right'
    /** 元件預設的色彩角色，事件自己的 color 優先 */
    color?: CamelotColorRole
    /** 標題為空時顯示的文字 */
    untitled?: string
    isDraft?: boolean
    readonly?: boolean
  }>(),
  {
    variant: 'block',
    resizable: undefined,
    color: 'primary',
    untitled: '',
    isDraft: false,
    readonly: false,
  },
)

const emit = defineEmits<{
  'move-start': [event: PointerEvent]
  'resize-start': [event: PointerEvent]
  'open': []
}>()

const {
  eventClass, draftClass, lockedClass,
} = useCamelotSchedulerTheme()

const roleColorClass = useCamelotRoleColorClass(() => props.event.color ?? props.color)

const TIME_FORMAT = 'HH:mm'

const startTime = computed(() => format(props.event.start, TIME_FORMAT))

const endTime = computed(() => format(props.event.end, TIME_FORMAT))

const displayTitle = computed(() => props.event.title || props.untitled)

const ariaLabel = computed(() => `${displayTitle.value} ${startTime.value} – ${endTime.value}`)
</script>
