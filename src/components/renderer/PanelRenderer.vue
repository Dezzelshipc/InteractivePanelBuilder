<script setup lang="ts">
import { computed } from 'vue'
import WidgetRenderer from './WidgetRenderer.vue'
import { panelConfig } from '@/schema/index.ts'

const config = panelConfig

const classes = computed(() => `panel-renderer wh ${config.value.layout.class}`)

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${config.value.layout.columns}, 1fr)`,
  gridTemplateRows: `repeat(${config.value.layout.rows}, 1fr)`,
  gap: `${config.value.layout.gap}px`,
  ...config.value.layout.style,
}))
</script>

<template>
  <div :class="classes" :style="gridStyle" @dragover.prevent>
    <WidgetRenderer
      v-for="(widget, id) in config.widgets"
      :id="`widget-${id}`"
      :key="id"
      :widgetId="id"
      v-model:widgetConfig="config.widgets[id] as typeof widget"
    />
  </div>
</template>
