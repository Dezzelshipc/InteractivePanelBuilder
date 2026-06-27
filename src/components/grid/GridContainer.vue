<script setup lang="ts">
import type { Layout, Widget } from '@/schema/schema'
import GridItem from './GridItem.vue'

defineProps<{
  layout: Layout
  widgets: Widget[]
}>()

function formatClasses(classes: string[] | undefined): string {
  if (classes && classes !== undefined) return ` ${classes.join(' ')}`
  else return ''
}

function isNumeric(value: string): boolean {
  return /^-?\d+$/.test(value)
}

function formatGridTemplate(str: string): string {
  if (isNumeric(str)) return `repeat(${str}, 1fr)`
  else return str
}

function formatGap(str: string | undefined): string | undefined {
  if (str === undefined || !isNumeric(str)) return str
  else return `${str}px`
}
</script>

<template>
  {{ layout }}
  <div
    :class="'grid' + formatClasses(layout.class)"
    :style="`
      grid-template-columns: ${formatGridTemplate(layout.columns)};
      grid-template-rows: ${formatGridTemplate(layout.rows)}; 
      gap: ${formatGap(layout.gap)};
      `"
  >
    <GridItem v-for="w of widgets" :position="w.position">{{ w.id }}</GridItem>
  </div>
</template>

<style scoped></style>
