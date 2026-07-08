<script setup lang="ts">
import { ref } from 'vue'
import type { TextWidgetProps } from '.'
import { useWebData } from '@/composable/useWidgetData'

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
</script>

<template>
  <div :class="[alignY(widgetProps.y_align), 'wh flex flex-col']">
    <p v-if="props.widgetProps.text" :class="[alignX(widgetProps.x_align), 'whitespace-pre-line']">
      {{ data ?? props.widgetProps.text }}
    </p>
  </div>
</template>
