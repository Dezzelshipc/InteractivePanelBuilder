<script setup lang="ts">
import type { FullTextWidgetProps } from '.'

const props = defineProps<{
  widgetProps: FullTextWidgetProps
}>()

function alignX(value: number) {
  return ['self-start text-start', 'self-center text-center', 'self-end text-end'][value]
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
