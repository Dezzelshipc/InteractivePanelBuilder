<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TextWidgetProps } from '.'
import { useWebData } from '@/composable/useWidgetData'
import { isEditorMode, isPanelMode } from '@/components/editor/editorController'

const props = defineProps<{
  widgetProps: TextWidgetProps
}>()

function alignX(value: number) {
  return ['self-start text-start', 'self-center text-center', 'self-end text-end'][value]
}

function alignY(value: number) {
  return ['justify-start', 'justify-center', 'justify-end'][value]
}

const { data } = useWebData(() => props.widgetProps.dataSource, 200)

const showText = computed(() => {
  if (!isEditorMode.value && data.value) return data.value
  return props.widgetProps.text
})
</script>

<template>
  <div :class="[alignY(widgetProps.y_align), 'wh flex flex-col']">
    <p v-if="props.widgetProps.text" :class="[alignX(widgetProps.x_align), 'whitespace-pre-line']">
      {{ showText }}
    </p>
  </div>
</template>
