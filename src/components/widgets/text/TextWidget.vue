<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TextWidgetProps } from '.'
import { useWebSocket } from '@/composable/useWebSocket'
import { isEditorMode } from '@/components/editor/editorController'

const props = defineProps<{
  widgetProps: TextWidgetProps
}>()

function alignX(value: number) {
  return ['self-start text-start', 'self-center text-center', 'self-end text-end'][value]
}

function alignY(value: number) {
  return ['justify-start', 'justify-center', 'justify-end'][value]
}

const { data } = useWebSocket(() => props.widgetProps.dataSource, 200)

const showText = computed(() => {
  if (!isEditorMode.value && data.value) return data.value
  return props.widgetProps.text
})
</script>

<template>
  <div :class="[alignY(widgetProps.y_align), 'wh flex flex-col']">
    <p v-if="props.widgetProps.text" :class="[alignX(widgetProps.x_align), 'whitespace-pre-line']">
      {{ showText }}
      {{ props.widgetProps.dataSource }}
    </p>
  </div>
</template>
