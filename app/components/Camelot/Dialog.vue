<template>
  <dialog
    ref="dialog"
    class="bg-transparent max-h-full max-w-full w-screen h-screen "
  >
    <div
      class="flex items-center justify-center w-full h-full"
      @click="onBackgroundClick"
    >
      <slot name="dialog-content">
        <AppCard
          class="max-w-[85vw] md:max-w-[400px] w-full max-h-[360px] relative"
          @click="(events: MouseEvent) => {
            events.stopPropagation()
          }"
        >
          <button
            v-if="!props.disableCloseCross"
            class=" absolute top-2 right-2 bg-background text-on-background rounded-full text-sm p-1 outline-none"
            @click="open = false"
          >
            <IMaterialSymbolsClose />
          </button>
          <slot />
        </AppCard>
      </slot>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import IMaterialSymbolsClose from '~icons/material-symbols/close'

const props = defineProps<{
  disableCloseCross?: boolean
  closeOnBackgroundClick?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

const dialog = useTemplateRef('dialog')

watch([open, dialog], ([open, dialog]) => {
  if (!dialog) return

  if (open) {
    dialog.showModal()
  } else {
    dialog.close()
  }
}, { immediate: true })

const onBackgroundClick = () => {
  if (props.closeOnBackgroundClick) {
    open.value = false
  }
}
</script>

<style scoped>
dialog {
  transition:
    opacity 0.4s,
    display 0.4s allow-discrete,
    overlay 0.4s allow-discrete;
  transition-behavior: allow-discrete;
  opacity: 0;
}
dialog[open] {
  opacity: 1;
}
@starting-style {
  dialog[open] {
    opacity: 0;
  }
}

dialog::backdrop {
  background-color: rgba(0,0,0,0);
  transition: background-color 0.4s;
}
dialog[open]::backdrop {
  background-color: rgba(0, 0, 0, 0.4);
}
@starting-style {
  dialog[open]::backdrop {
    background-color: rgba(0,0,0,0);
  }
}
</style>
