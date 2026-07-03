<script setup lang="ts">
import type { WidgetPosition, PanelConfig } from '@/schema/config'
import { computed } from 'vue'
import WidgetRenderer from './WidgetRenderer.vue'

const props = defineProps<{
  config: PanelConfig
}>()

const classes = computed(() => `panel-renderer ${props.config.layout.class}`)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.config.layout.columns}, 1fr)`,
  gridTemplateRows: `repeat(${props.config.layout.rows}, 1fr)`,
  gap: `${props.config.layout.gap}px`,
  ...props.config.layout.style,
}))
</script>

<template>
  <div :class="classes" :style="gridStyle" @dragover.prevent>
    <WidgetRenderer
      v-for="(widget, id) in props.config.widgets"
      :id="`widget-${id}`"
      :key="id"
      :widgetId="id"
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
