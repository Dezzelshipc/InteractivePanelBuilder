<script setup lang="ts">
import { loadWidget } from '@/registry/loadWidget'
import { widgetRegistry } from '@/registry/widgetRegistry'
import type { WidgetConfig } from '@/schema/config'
import { ref, computed, onMounted, shallowRef, readonly } from 'vue'

import { ProgressSpinner } from 'primevue'
import type { PropSchema } from '@/schema/widget'
import { is_editor } from '../editor/editorController'

const props = defineProps<{
  widgetId: string
  widgetConfig: WidgetConfig
}>()

const widgetDef = shallowRef(widgetRegistry.get(props.widgetConfig.type))

const gridPosition = computed(() => {
  const { x, y, w, h } = props.widgetConfig.position
  return {
    gridColumn: `${x + 1} / span ${w}`,
    gridRow: `${y + 1} / span ${h}`,
  }
})

const containerStyle = computed(() => ({
  ...gridPosition.value,
  ...widgetDef.value?.defaultStyle,
  ...props.widgetConfig.style,
}))

function extractDefaults(schemas: PropSchema[] | undefined) {
  if (schemas === undefined) return {}
  const result: Record<string, any> = {}
  for (const schema of schemas) {
    if ('default' in schema) {
      result[schema.name] = schema.default
    }
  }
  return result
}
const widgetProps = computed(() =>
  readonly({
    ...extractDefaults(widgetDef.value?.propsSchema),
    ...props.widgetConfig.props,
  }),
)

const containerClass = computed(() => {
  const classes = props.widgetConfig.class
  if (classes && classes !== undefined) return ` ${classes.join(' ')}`
  else return ''
})

onMounted(async () => {
  if (!widgetDef.value) {
    await loadWidget(props.widgetConfig.type)
    widgetDef.value = widgetRegistry.get(props.widgetConfig.type)
  }
})
</script>

<template>
  <div
    class="widget-container relative"
    :class="`widget-${props.widgetConfig.type} ${containerClass}`"
    :style="containerStyle"
    draggable="true"
  >
    <component
      v-if="widgetDef && is_editor"
      :is="widgetDef.editor"
      :widget-id="widgetId"
      :widget-props="widgetProps"
      :prop-schemas="widgetDef.propsSchema"
    />
    <component v-if="widgetDef" :is="widgetDef.component" :text-props="widgetProps" />
    <div v-else class="widget-loading"><progress-spinner aria-label="loading" /></div>
  </div>
</template>

<style scoped>
.widget-container {
  overflow: hidden;
}
.widget-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}
</style>
