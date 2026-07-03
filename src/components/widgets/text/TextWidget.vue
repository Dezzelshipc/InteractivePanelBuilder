<script setup lang="ts">
import type { TextWidgetProps } from '.'

const props = defineProps<{
  textProps: TextWidgetProps
}>()
</script>

<template>
  <h1 v-if="props.textProps.title" :class="{ 'text-center': props.textProps.title_center }">
    {{ props.textProps.title }}
  </h1>
  <p v-if="props.textProps.text" :class="{ 'text-center': props.textProps.text_center }">
    {{ props.textProps.text }}
  </p>
</template>

<style scoped></style>
