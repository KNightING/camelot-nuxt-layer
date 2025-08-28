<template>
  <div class="flex flex-col ">
    <label class="text-primary text-base">{{ props.label }}</label>
    <input
      :id="id"
      type="file"
      class="hidden"
      accept="image/*"
      @change="onImageChange"
    >
    <div class="relative">
      <label
        ref="dropZoneRef"
        :for="id"
        class="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xl px-4 whitespace-pre-wrap text-center"
        :class="{
          'z-10 bg-blue-300/80 font-bold border-4 border-primary border-dashed': isOverDropZone,
        }"
      >{{ image || originImage ? "" : placeholderText }}</label>
      <div
        class="aspect-square border border-outline relative pointer-events-none"
        :class="{
          'aspect-video': isAspectVideo,
        }"
      >
        <img
          ref="itemImageRef"
          class="outline-none border-none w-full h-full object-cover absolute top-0"
        >
        <div
          v-if="image === undefined && originImage"
          class="absolute top-0 w-full h-full"
        >
          <CamelotSkeleton
            v-if="isLoading"
            height="100%"
            width="100%"
          />
          <img
            v-else
            :src="originImage"
            class="outline-none border-none w-full h-full object-cover"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImage } from '@vueuse/core'
import { CamelotSkeleton } from '../../.playground/.nuxt/components'

const props = defineProps<{
  label?: string
  modelValue?: File | string
  originImage?: string
  id?: string
  placeholderText?: string
  isAspectVideo?: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value?: File | string]
}>()

const imageOptions = ref({ src: props?.originImage ?? '' })

const { isLoading } = useImage(imageOptions)

const image = computed({
  get() {
    return props.modelValue
  },
  set(image) {
    const imageElement = itemImageRef.value

    if (imageElement && image) {
      if (image instanceof File) {
        const reader = new FileReader()
        reader.addEventListener('load', (event) => {
          if (event.target) {
            imageElement.src = event.target.result as string
          }
        })
        reader.readAsDataURL(image)
      } else if (typeof image === 'string') {
        imageElement.src = image
        const { isLoading } = useImage({ src: image })
      }
    }

    emit('update:modelValue', image)
  },
})

const id = ref(
  props.id ?? `file-selector-${new Date().getTime()}-${useRandom()}-${useRandom()}`,
)

const itemImageRef = ref<HTMLImageElement>()

//  渲染圖片
// watch([itemImageRef, image], (nV) => {
//   let itemImageRef = nV[0] as HTMLImageElement;
//   let image = nV[1] as File | string;

//   if (itemImageRef && image) {
//     if (image instanceof File) {
//       const reader = new FileReader();
//       reader.addEventListener("load", (event) => {
//         if (event.target) {
//           itemImageRef.src = event.target.result as string;
//         }
//       });
//       reader.readAsDataURL(image);
//     } else if (typeof image === "string") {
//       itemImageRef.src = image;
//       const { isLoading } = useImage({ src: image });
//     }
//   }
//   emit("update:modelValue", image);
// });

const dropZoneRef = ref<HTMLDivElement>()

const setImageRef = (file: File) => {
  if (!itemImageRef.value) {
    return
  }

  itemImageRef.value.src = ''
  if (!file.type) {
    //   console.log(
    //     "Error: The File.type property does not appear to be supported on this browser."
    //   );
    return
  }
  if (!file.type.match('image.*')) {
    //   console.log("Error: The selected file does not appear to be an image.");
    return
  }
  image.value = file
}

function onImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (itemImageRef.value && target.files && target.files.length > 0) {
    setImageRef(target.files[0])
  }
}

const onDrop = (files: File[] | null) => {
  if (itemImageRef.value && files && files.length > 0) {
    setImageRef(files[0])
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<style scoped></style>
