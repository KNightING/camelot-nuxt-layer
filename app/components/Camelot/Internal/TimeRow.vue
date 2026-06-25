<template>
  <div class="flex items-center gap-2">
    <IMaterialSymbolsScheduleRounded class="w-5 h-5 text-outline shrink-0" />
    <div class="flex items-center bg-surface-container rounded-lg p-1">
      <CamelotInternalTimeField
        v-model="displayHour"
        :min="hourFormat === '12' ? 1 : 0"
        :max="hourFormat === '12' ? 12 : 23"
      />
      <template v-if="precision !== 'hour'">
        <span class="text-outline">:</span>
        <CamelotInternalTimeField
          v-model="minuteModel"
          :min="0"
          :max="59"
        />
      </template>
      <template v-if="precision === 'second'">
        <span class="text-outline">:</span>
        <CamelotInternalTimeField
          v-model="secondModel"
          :min="0"
          :max="59"
        />
      </template>
    </div>
    <button
      v-if="hourFormat === '12'"
      type="button"
      class="rounded-lg bg-surface-container px-3 py-1.5 text-sm font-semibold text-[var(--cml-color-current-color)] transition-colors hover:bg-surface-container-high"
      @click="toggleMeridiem"
    >
      {{ isPM ? 'PM' : 'AM' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import IMaterialSymbolsScheduleRounded from '~icons/material-symbols/schedule-rounded'

const props = withDefaults(
  defineProps<{
    precision?: 'hour' | 'minute' | 'second'
    hourFormat?: '12' | '24'
  }>(),
  {
    precision: 'second',
    hourFormat: '24',
  },
)

// 內部一律 24 小時制
const hours = defineModel<number>('hours', { default: 0 })
const minutes = defineModel<number>('minutes', { default: 0 })
const seconds = defineModel<number>('seconds', { default: 0 })

const emit = defineEmits<{ change: [] }>()

const isPM = computed(() => hours.value >= 12)

const displayHour = computed<number>({
  get: () => (props.hourFormat === '12' ? (hours.value % 12 === 0 ? 12 : hours.value % 12) : hours.value),
  set: (v) => {
    if (props.hourFormat === '12') {
      const base = ((v % 12) + 12) % 12
      hours.value = isPM.value ? base + 12 : base
    }
    else {
      hours.value = v
    }
    emit('change')
  },
})
const minuteModel = computed<number>({
  get: () => minutes.value,
  set: (v) => {
    minutes.value = v
    emit('change')
  },
})
const secondModel = computed<number>({
  get: () => seconds.value,
  set: (v) => {
    seconds.value = v
    emit('change')
  },
})
const toggleMeridiem = () => {
  hours.value = (hours.value + 12) % 24
  emit('change')
}
</script>
