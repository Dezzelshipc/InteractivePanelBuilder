<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import WidgetRenderer from './WidgetRenderer.vue'
import { panelConfig } from '@/schema/index.ts'

const config = panelConfig

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${config.value.layout.columns}, 1fr)`,
  gridTemplateRows: `repeat(${config.value.layout.rows}, 1fr)`,
  gap: `${config.value.layout.gap ?? 0}px`,
  zIndex: 1,
  ...config.value.layout.styleGrid,
}))
</script>

<template>
  <div class="relative wh">
    <div
      :class="['panel-bg wh', config.layout.classBackground]"
      :style="config.layout.styleBackground"
    ></div>
    <div
      :class="['panel-renderer relative wh', config.layout.classGrid]"
      :style="gridStyle"
      @dragover.prevent
    >
      <WidgetRenderer
        v-for="(widget, id) in config.widgets"
        :id="`widget-${id}`"
        :key="id"
        :widgetId="id"
        v-model:widgetConfig="config.widgets[id] as typeof widget"
      />
    </div>
  </div>
</template>

<style scoped>
.panel-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  bottom: 0px;
  pointer-events: none;
  background-attachment: fixed;
}
</style>
