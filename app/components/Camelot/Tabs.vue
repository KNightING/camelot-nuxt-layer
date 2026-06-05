<template>
  <ul :class="[themeMode]" class="tabs-container">
    <li
      v-for="(option, index) in options"
      ref="tabsElRefs"
      :key="option.value"
      @click="onClick(index, option)"
      @mouseenter="() => trigger === 'hover' && onClick(index, option)"
    >
      <slot
        :item="option"
        :option="option"
        :data="option.data"
        :text="getText(option)"
        :index="index"
        :is-selected="isSelected(option.value)"
      >
        <!-- Sci-fi Theme Tab -->
        <div
          v-if="themeMode === 'scifi'"
          class="tab scifi-tab"
          :class="{ 'tab-selected': isSelected(option.value) }"
        >
          <CamelotScifiReticle :active="isSelected(option.value)" />
          <span class="relative z-10 font-mono tracking-wider">{{ getText(option) }}</span>
        </div>

        <!-- Cupertino Theme Tab -->
        <div
          v-else-if="themeMode === 'cupertino'"
          class="tab cupertino-tab"
          :class="{ 'tab-selected': isSelected(option.value) }"
        >
          {{ getText(option) }}
        </div>

        <!-- Material Theme Tab (Default) -->
        <CamelotRippleEffect
          v-else
          class="tab material-tab"
          :class="{
            'tab-selected': isSelected(option.value),
          }"
        >
          {{ getText(option) }}
        </CamelotRippleEffect>
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T">
const props = withDefaults(
  defineProps<{
    options?: SelectOptions<T>
    dataKey?: string
    scrollSmooth?: boolean
    trigger?: 'click' | 'hover' | 'manual'
  }>(),
  {
    scrollSmooth: true,
  }
)

const emit = defineEmits<{
  click: [index: number, option: SelectOption<T>]
  changed: [index: number, option: SelectOption<T>]
}>()

const { themeMode } = useCamelotTheme()

const isValidKey = (
  key: string | number | symbol,
  object: object,
): key is keyof typeof object => {
  return key in object
}

const getText = (option: SelectOption<T>) => {
  const data = option.data

  if (data && props.dataKey && typeof data === 'object' && isValidKey(props.dataKey, data as object)) {
    return data[props.dataKey]
  }
  else {
    return option.name
  }
}

const selected = defineModel<string | number>()

const isSelected = (val: string | number) => {
  return val === selected.value
}

const selectedIndex = defineModel<number | undefined>('selectedIndex', {
  get() {
    return props.options?.findIndex(option => option.value === selected.value) ?? undefined
  },
  set(v) {
    if (v !== undefined) {
      const option = props.options?.at(v)
      if (option) {
        selected.value = option.value
      }
    }
    return v
  },
})

const tabsElRefs = ref<HTMLElement[]>([])

const onClick = (index: number, option: SelectOption<T>) => {
  emit('click', index, option)

  if (props.trigger === 'manual') {
    return
  }

  if (selectedIndex.value === index) {
    return
  }
  selected.value = option.value
  emit('changed', index, option)
}

const scrollToTab = () => {
  const index = toValue(selectedIndex)
  if (index === undefined || props.options === undefined || index > props.options.length) {
    return
  }

  const tabEl = tabsElRefs.value[index]
  if (!tabEl) {
    return
  }
  const parentEl = tabEl.parentElement
  if (!parentEl) {
    return
  }

  const parentWidth = parentEl.clientWidth
  const tabWidth = tabEl.clientWidth

  let scrollLeft = tabEl.offsetLeft - (parentWidth - tabWidth) / 2

  if (scrollLeft < 0) {
    scrollLeft = 0
  }
  else if (scrollLeft > parentEl.scrollWidth) {
    scrollLeft = parentEl.scrollWidth
  }

  parentEl.scrollTo({
    left: scrollLeft,
    behavior: props.scrollSmooth ? 'smooth' : 'auto',
  })
}

onUpdated(() => {
  scrollToTab()
})

onMounted(() => {
  scrollToTab()
})
</script>

<style scoped>
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.tabs-container {
  display: flex;
  overflow-x: auto;
  padding: 0.5rem;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 1rem;
  align-items: center;
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  transition: all 300ms ease;
  user-select: none;
}

li {
  flex-shrink: 0;
  list-style: none;
}

/* Material styles */
.tabs-container.material {
  border-bottom: 1px solid var(--cml-c-m3-outline-variant, #e0e0e0);
  gap: 0.5rem;
  padding-bottom: 0px;
}
.material-tab {
  padding: 0.5rem 1.25rem !important;
  border-radius: 9999px;
  color: var(--cml-c-m3-on-surface-variant, #49454f);
  cursor: pointer;
  transition: all 0.2s ease;
}
.material-tab.tab-selected {
  background-color: var(--cml-color-current-color, var(--color-primary)) !important;
  color: var(--cml-color-current-on-color, #ffffff) !important;
}

/* Cupertino Segmented styles */
.tabs-container.cupertino {
  background-color: var(--cml-c-m3-surface-container-highest, #f3f3f3);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}
.cupertino-tab {
  padding: 0.375rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--cml-c-m3-on-surface-variant, #555555);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  text-align: center;
}
.cupertino-tab.tab-selected {
  background-color: var(--cml-c-m3-surface, #ffffff);
  color: var(--cml-c-m3-on-surface, #000000);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

/* Sci-Fi HUD styles */
.tabs-container.scifi {
  gap: 1.5rem;
}
.scifi-tab {
  position: relative;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  color: color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 70%, white);
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 30%, transparent);
  clip-path: polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px);
  transition: all 0.2s;
}
.scifi-tab.tab-selected {
  color: #ffffff;
  border-color: var(--cml-color-current-color, var(--color-primary));
  background-color: color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 20%, transparent);
  box-shadow: 0 0 10px color-mix(in srgb, var(--cml-color-current-color, var(--color-primary)) 50%, transparent);
}
</style>
