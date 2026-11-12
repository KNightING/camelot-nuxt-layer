<template>
  <CamelotBaseDialogV2
    v-model:open="open"
    @cancel="emit('cancel')"
  >
    <div class="flex w-[min(24rem,80vw)] flex-col gap-4">
      <h3 class="text-lg font-bold">
        {{ isNew ? labels.newEvent : labels.editEvent }}
      </h3>

      <CamelotInput
        v-model="title"
        :label="labels.title"
        :disabled="readonly"
        :color="color"
      />

      <div class="flex flex-col gap-3 sm:flex-row">
        <label class="flex min-w-0 flex-1 flex-col gap-1.5">
          <span class="pl-1 text-sm font-semibold text-on-surface">{{ labels.start }}</span>
          <input
            v-model="startText"
            type="datetime-local"
            class="w-full px-3 text-on-surface outline-none"
            :class="fieldClass"
            :disabled="readonly"
          >
        </label>
        <label class="flex min-w-0 flex-1 flex-col gap-1.5">
          <span class="pl-1 text-sm font-semibold text-on-surface">{{ labels.end }}</span>
          <input
            v-model="endText"
            type="datetime-local"
            class="w-full px-3 text-on-surface outline-none"
            :class="fieldClass"
            :disabled="readonly"
          >
        </label>
      </div>

      <label
        v-if="resources.length > 0"
        class="flex flex-col gap-1.5"
      >
        <span class="pl-1 text-sm font-semibold text-on-surface">{{ labels.resource }}</span>
        <select
          v-model="resourceKey"
          class="w-full px-3 text-on-surface outline-none"
          :class="fieldClass"
          :disabled="readonly"
        >
          <option :value="NO_RESOURCE_KEY">
            {{ labels.noResource }}
          </option>
          <option
            v-for="resource in resources"
            :key="resource.id"
            :value="String(resource.id)"
          >
            {{ resource.name }}
          </option>
        </select>
      </label>

      <div class="flex flex-col gap-1.5">
        <span class="pl-1 text-sm font-semibold text-on-surface">{{ labels.color }}</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="role in COLOR_ROLES"
            :key="role"
            type="button"
            class="h-7 w-7 cursor-pointer rounded-full outline-none transition-transform duration-300 focus-visible:tactile-ring disabled:cursor-not-allowed disabled:opacity-50"
            :class="[easeClass, role === eventColor ? 'scale-110 ring-2 ring-on-surface ring-offset-2 ring-offset-surface' : 'hover:scale-105']"
            :style="{ backgroundColor: `var(--color-${role})` }"
            :aria-label="role"
            :aria-pressed="role === eventColor"
            :disabled="readonly"
            @click="eventColor = role"
          />
        </div>
      </div>

      <p
        v-if="!isRangeValid"
        class="text-sm text-error"
        role="alert"
      >
        {{ labels.end }} &gt; {{ labels.start }}
      </p>

      <div class="flex items-center justify-between gap-3">
        <CamelotButton
          v-if="!isNew && !readonly"
          :label="labels.delete"
          color="error"
          is-container
          @click="emit('delete')"
        />
        <span v-else />
        <div class="flex gap-2">
          <CamelotButton
            :label="labels.cancel"
            color="secondary"
            is-container
            @click="open = false"
          />
          <CamelotButton
            v-if="!readonly"
            :label="labels.save"
            :color="color"
            :disabled="!isRangeValid"
            @click="onSubmit"
          />
        </div>
      </div>
    </div>
  </CamelotBaseDialogV2>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const props = withDefaults(
  defineProps<{
    /** 正在編輯的事件；新增時是手勢或點擊產生的暫時事件 */
    event?: CamelotSchedulerEvent | null
    isNew?: boolean
    resources?: CamelotSchedulerResource[]
    labels: CamelotSchedulerLabels
    /** 鎖定的事件只能檢視 */
    readonly?: boolean
    color?: CamelotColorRole
  }>(),
  {
    event: null,
    isNew: false,
    resources: () => [],
    readonly: false,
    color: 'primary',
  },
)

const emit = defineEmits<{
  save: [event: CamelotSchedulerEvent]
  delete: []
  cancel: []
}>()

const open = defineModel<boolean>('open', { default: false })

// datetime-local 輸入框的值格式：本地時間，到分鐘
const DATETIME_LOCAL_FORMAT = 'yyyy-MM-dd\'T\'HH:mm'
// 下拉選單的「沒有人員」選項值；人員 id 一律轉成字串比對，避免數字與字串 id 混淆
const NO_RESOURCE_KEY = ''
const COLOR_ROLES: CamelotColorRole[] = ['primary', 'secondary', 'tertiary', 'success', 'info', 'warning', 'error']

const { triggerClass } = useCamelotPickerTheme()
const { easeClass } = useCamelotSchedulerTheme()

const fieldClass = computed(() => [triggerClass.value, 'bg-transparent'])

const title = ref('')
const startText = ref('')
const endText = ref('')
const resourceKey = ref(NO_RESOURCE_KEY)
const eventColor = ref<CamelotColorRole>(props.color)

// 打開或換成另一筆事件時，把欄位重設成那筆事件的值
watch(
  () => [open.value, props.event] as const,
  ([isOpen, event]) => {
    if (!isOpen || !event) return
    title.value = event.title
    startText.value = format(event.start, DATETIME_LOCAL_FORMAT)
    endText.value = format(event.end, DATETIME_LOCAL_FORMAT)
    resourceKey.value = event.resourceId === undefined ? NO_RESOURCE_KEY : String(event.resourceId)
    eventColor.value = event.color ?? props.color
  },
  { immediate: true },
)

const parsedStart = computed(() => new Date(startText.value))

const parsedEnd = computed(() => new Date(endText.value))

const isRangeValid = computed(() =>
  !Number.isNaN(parsedStart.value.getTime())
  && !Number.isNaN(parsedEnd.value.getTime())
  && parsedEnd.value > parsedStart.value,
)

const onSubmit = () => {
  if (!props.event || props.readonly || !isRangeValid.value) return
  const resource = props.resources.find(item => String(item.id) === resourceKey.value)
  emit('save', {
    ...props.event,
    title: title.value,
    start: parsedStart.value,
    end: parsedEnd.value,
    resourceId: resource?.id,
    color: eventColor.value,
  })
}
</script>
