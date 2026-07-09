<script setup lang="ts">
import { l10n } from '@/localization'
import { widgetRegistry } from '@/registry/widgetRegistry'
import { panelConfig, saveLocalSchema } from '@/schema'
import { extractSchemaDefaults, getRandomInt, getVal } from '@/utility'
import { Select, type SelectChangeEvent } from 'primevue'
import { ref } from 'vue'

const widgets = ref()

function change(event: SelectChangeEvent) {
  const t = event.value
  const widget = widgetRegistry.get(t)

  let widgetId: string
  do {
    widgetId = `${t}-${getRandomInt(0, 1e10)}`
  } while (panelConfig.value.widgets[widgetId])

  panelConfig.value.widgets[widgetId] = {
    type: t,
    position: { x: 0, y: 0, w: 1, h: 1 },
    props: extractSchemaDefaults(widget?.propsSchema),
    class: widget?.defaultClass ?? '',
    style: widget?.defaultStyle ?? {},
  }
  saveLocalSchema()
}

function beforeShow() {
  widgets.value = widgetRegistry.getAll()
}
</script>

<template>
  <Select
    :options="widgets"
    optionLabel="label"
    optionValue="type"
    :placeholder="l10n.editor.toolbar.add_widget"
    @change="change"
    @before-show="beforeShow"
  >
    <template #value>
      <i class="pi pi-folder" />
      {{ l10n.editor.toolbar.add_widget }}
    </template>

    <template #option="slotProps">
      <div class="flex items-center gap-3 py-1">
        {{ slotProps.option.icon }}
        <div class="flex flex-col">
          <span class="font-medium">
            {{ getVal(l10n, slotProps.option.label, slotProps.option.label) }}
          </span>
          <span class="text-xs text-surface-500">{{ slotProps.option.description }}</span>
        </div>
      </div>
    </template>
  </Select>
</template>
