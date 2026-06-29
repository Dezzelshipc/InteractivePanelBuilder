<script setup lang="ts">
import type { TextWidgetProps } from '.'

const props = defineProps<{
  textProps: TextWidgetProps
}>()
</script>

<template>
  <h1 v-if="props.textProps.title">{{ props.textProps.title }}</h1>
  <div v-if="props.textProps.title">{{ props.textProps.text }}</div>
</template>

<style scoped></style>
