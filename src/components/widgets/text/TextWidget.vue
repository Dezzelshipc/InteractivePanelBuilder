<script setup lang="ts">
import type { TextWidgetProps } from '.'

const props = defineProps<{
  widgetProps: TextWidgetProps
}>()

function alignX(value: number) {
  return ['self-start', 'self-center', 'self-end'][value]
}

function alignY(value: number) {
  return ['justify-start', 'justify-center', 'justify-end'][value]
}
</script>

<template>
  <div :class="[alignY(widgetProps.self_align), 'wh flex flex-col']">
    <h1
      v-if="props.widgetProps.title"
      :class="[alignX(widgetProps.title_align), 'whitespace-pre-line']"
    >
      {{ props.widgetProps.title }}
    </h1>
    <p
      v-if="props.widgetProps.text"
      :class="[alignX(widgetProps.text_align), 'whitespace-pre-line']"
    >
      {{ props.widgetProps.text }}
    </p>
  </div>
</template>

<style scoped></style>
