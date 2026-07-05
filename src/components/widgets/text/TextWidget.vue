<script setup lang="ts">
import type { TextWidgetProps } from '.'

const props = defineProps<{
  textProps: TextWidgetProps
}>()

function alignX(value: number) {
  return ['self-start', 'self-center', 'self-end'][value]
}

function alignY(value: number) {
  return ['justify-start', 'justify-center', 'justify-end'][value]
}
</script>

<template>
  <div :class="[alignY(textProps.self_align), 'wh flex flex-col']">
    <h1
      v-if="props.textProps.title"
      :class="[alignX(textProps.title_align), 'whitespace-pre-line']"
    >
      {{ props.textProps.title }}
    </h1>
    <p v-if="props.textProps.text" :class="[alignX(textProps.text_align), 'whitespace-pre-line']">
      {{ props.textProps.text }}
    </p>
  </div>
</template>

<style scoped></style>
