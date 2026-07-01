<script setup lang="ts">
import type { PanelConfig } from '@/schema/config'
import { computed } from 'vue'
import WidgetRenderer from './WidgetRenderer.vue'

const props = defineProps<{
  config: PanelConfig
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

const classes = computed(() => `panel-renderer ${formatClasses(props.config.layout.class)}`)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: formatGridTemplate(props.config.layout.columns),
  gridTemplateRows: formatGridTemplate(props.config.layout.rows),
  gap: formatGap(props.config.layout.gap),
  ...props.config.layout.style,
}))
</script>

<template>
  <div :class="classes" :style="gridStyle">
    <WidgetRenderer
      v-for="(widget, id) in props.config.widgets"
      :id="`widget-${id}`"
      :key="id"
      :widget-id="id"
      :widgetConfig="widget"
    />
  </div>
</template>

<style scoped>
.panel-renderer {
  width: 100%;
  height: 100%;
}
</style>
