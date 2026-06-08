<template>
  <button
    class="group inline-block cursor-pointer border-none bg-transparent p-0 outline-none disabled:cursor-not-allowed"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <CamelotRippleEffect
      class="block rounded-full"
      :ripple-color="rippleColor"
    >
      <div
        class="flex items-center justify-center gap-2 rounded-full bg-[var(--cml-color-current-color)] px-6 py-2.5 text-sm font-medium text-[var(--cml-color-current-on-color)] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:brightness-110 group-hover:shadow-[0_3px_6px_rgba(0,0,0,0.16),0_3px_6px_rgba(0,0,0,0.23)] group-disabled:opacity-[0.38] group-disabled:!brightness-100 group-disabled:!shadow-none"
      >
        <slot />
      </div>
    </CamelotRippleEffect>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean
    color?: string
    isContainer?: boolean
  }>(),
  {
    disabled: false,
    color: 'primary',
    isContainer: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const rippleColor = computed(() => {
  return props.isContainer ? `var(--color-on-${props.color}-container)` : '#ffffff'
})
</script>
