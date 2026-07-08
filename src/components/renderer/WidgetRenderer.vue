<script setup lang="ts">
import { loadWidget } from '@/registry/loadWidget'
import { widgetRegistry } from '@/registry/widgetRegistry'
import type { WidgetConfig, WidgetPosition } from '@/schema/config'
import { computed, onMounted, shallowRef, watch } from 'vue'

import { ProgressSpinner } from 'primevue'
import type { PropSchema } from '@/schema/widget'
import { isEditorMode } from '../editor/editorController'
import { useDragDrop } from '@/composable/useDragDrop'
import { panelConfig } from '@/schema'
import { useResize } from '@/composable/useResize'
import StyleWidgetEditor from '../editor/StyleWidgetEditor.vue'
import { extractSchemaDefaults } from '@/utility/index.ts'
import { useWidgetData } from '@/composable/useWidgetData.ts'

const props = defineProps<{
  widgetId: string
}>()

const widgetConfig = defineModel<WidgetConfig>('widgetConfig', { required: true })

const widgetDef = shallowRef(widgetRegistry.get(widgetConfig.value.type))

widgetConfig.value.props = {
  ...extractSchemaDefaults(widgetDef.value?.propsSchema),
  ...widgetConfig.value.props,
}

const gridPosition = computed(() => {
  const { x, y, w, h } = widgetConfig.value.position
  return {
    gridColumn: `${x + 1} / span ${w}`,
    gridRow: `${y + 1} / span ${h}`,
  }
})

function getLayoutParams() {
  const container = document.querySelector('.panel-renderer') as HTMLElement
  if (!container) return null
  const rect = container.getBoundingClientRect()

  const { columns, rows, gap } = panelConfig.value.layout
  const gapNum = gap || 0

  const colWidth = (rect.width - (columns - 1) * gapNum) / columns
  const rowHeight = (rect.height - (rows - 1) * gapNum) / rows

  return { columns, rows, gapNum, colWidth, rowHeight, container }
}

let startPosition: WidgetPosition

const { isDragging, dragHandlers } = useDragDrop({
  widgetId: props.widgetId,
  onDragStart: () => {
    startPosition = widgetConfig.value.position
  },
  onDrag: (e, dx, dy) => {
    const params = getLayoutParams()
    if (!params) return
    const { columns, rows, gapNum, colWidth, rowHeight } = params

    const { x, y, w, h } = startPosition
    const newX = Math.round((x * (colWidth + gapNum) + dx) / (colWidth + gapNum))
    const newY = Math.round((y * (rowHeight + gapNum) + dy) / (rowHeight + gapNum))

    const maxX = columns - w
    const maxY = rows - h
    const clampedX = Math.max(0, Math.min(newX, maxX))
    const clampedY = Math.max(0, Math.min(newY, maxY))

    const widget = panelConfig.value.widgets[props.widgetId]
    if (widget) {
      widget.position = { ...widget.position, x: clampedX, y: clampedY, w, h }
    }
  },
})

const { isResizing, handleMouseDown } = useResize({
  widgetId: props.widgetId,
  onResizeStart: (direction, e) => {
    startPosition = widgetConfig.value.position
  },
  onResizeMove: (direction, dx, dy) => {
    const params = getLayoutParams()
    if (!params) return
    const { colWidth, rowHeight, columns, rows, gapNum } = params

    const { x, y, w, h } = startPosition

    const deltaW = Math.round(dx / (colWidth + gapNum))
    const deltaH = Math.round(dy / (rowHeight + gapNum))

    let newX = x,
      newY = y,
      newW = w,
      newH = h

    switch (direction) {
      case 'right':
        newW = Math.max(1, w + deltaW)
        break
      case 'left':
        newW = Math.max(1, w - deltaW)
        newX = x + (w - newW)
        break
      case 'bottom':
        newH = Math.max(1, h + deltaH)
        break
      case 'top':
        newH = Math.max(1, h - deltaH)
        newY = y + (h - newH)
        break
      case 'top-left':
        newW = Math.max(1, w - deltaW)
        newX = x + (w - newW)
        newH = Math.max(1, h - deltaH)
        newY = y + (h - newH)
        break
      case 'top-right':
        newW = Math.max(1, w + deltaW)
        newH = Math.max(1, h - deltaH)
        newY = y + (h - newH)
        break
      case 'bottom-left':
        newW = Math.max(1, w - deltaW)
        newX = x + (w - newW)
        newH = Math.max(1, h + deltaH)
        break
      case 'bottom-right':
        newW = Math.max(1, w + deltaW)
        newH = Math.max(1, h + deltaH)
        break
    }

    const maxX = columns - newW
    const maxY = rows - newH
    newX = Math.max(0, Math.min(newX, maxX))
    newY = Math.max(0, Math.min(newY, maxY))

    const widget = panelConfig.value.widgets[props.widgetId]
    if (widget) {
      widget.position = { ...widget.position, x: newX, y: newY, w: newW, h: newH }
    }
  },
})

const { data, error } = useWidgetData(widgetConfig.value.props.dataSource, 200)

watch(
  () => data.value,
  () => {
    const widget = panelConfig.value.widgets[props.widgetId]
    if (widget) {
      panelConfig.value.widgets[props.widgetId] = data.value
    }
  },
)

onMounted(async () => {
  if (!widgetDef.value) {
    await loadWidget(widgetConfig.value.type)
    widgetDef.value = widgetRegistry.get(widgetConfig.value.type)
  }
})
</script>

<template>
  <div
    class="widget-container relative flex"
    :class="[
      { dragging: isDragging, resizing: isResizing, is_editor: isEditorMode },
      `widget-${widgetConfig.type}`,
      widgetConfig.class,
    ]"
    :style="gridPosition"
    v-bind="dragHandlers"
    :draggable="isEditorMode"
    :data-widget-id="widgetId"
  >
    <template v-if="isEditorMode">
      <div
        v-for="dir in [
          'top-left',
          'top',
          'top-right',
          'right',
          'bottom-right',
          'bottom',
          'bottom-left',
          'left',
        ]"
        :key="dir"
        class="resize-handle"
        :class="`handle-${dir}`"
        @mousedown="handleMouseDown(dir, $event)"
        @mouseup.stop
        @click.stop
      ></div>
    </template>
    <section
      class="absolute top-1 right-1 flex flex-col items-center gap-1 opacity-90"
      v-if="isEditorMode"
    >
      <component
        v-if="widgetDef"
        :is="widgetDef.editor"
        :widget-id="widgetId"
        :prop-schemas="widgetDef.propsSchema"
        v-model:widget-props="widgetConfig.props"
      />
      <style-widget-editor
        :widget-id="widgetId"
        v-model:class="widgetConfig.class"
        v-model:style="widgetConfig.style"
        v-model:pos="widgetConfig.position"
      />
    </section>
    <section
      class="overflow-hidden flex flex-col wh"
      :style="widgetConfig.style as Record<string, any>"
    >
      <component v-if="widgetDef" :is="widgetDef.component" :widget-props="widgetConfig.props" />

      <div v-else class="widget-loading"><progress-spinner aria-label="loading" /></div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.widget-container {
  &.is_editor {
    cursor: grab;
    transition: 0.2s;

    border-radius: 1rem;
    border: 0px dashed red;
  }

  &.dragging {
    cursor: grabbing;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.7);
    z-index: 100;
  }
}

.widget-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.resize-handle {
  position: absolute;
  width: 15px;
  height: 15px;
  background: rgba(59, 130, 246, 0.6);
  border: 1px solid #fff;
  border-radius: 4px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
}
.widget-container:hover,
.widget-container.resizing {
  & .resize-handle {
    opacity: 1;
  }
  &.is_editor {
    border-width: 2px;
  }
}

.handle-top-left {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}
.handle-top {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
  width: 20px;
}
.handle-top-right {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}
.handle-right {
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
  cursor: e-resize;
  height: 20px;
}
.handle-bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}
.handle-bottom {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
  width: 20px;
}
.handle-bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}
.handle-left {
  top: 50%;
  left: -5px;
  transform: translateY(-50%);
  cursor: w-resize;
  height: 20px;
}
</style>
