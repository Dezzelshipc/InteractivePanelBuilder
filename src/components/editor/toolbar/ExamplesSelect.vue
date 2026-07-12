<script setup lang="ts">
import { l10n } from '@/localization'
import { widgetRegistry } from '@/components/widgets/widgetRegistry'
import { loadingSchemaToast, loadSchemaFromJSON, panelConfig, saveLocalSchema } from '@/schema'
import { defaultStyle } from '@/schema/config'
import { extractSchemaDefaults, getRandomInt, getVal } from '@/utility'
import { Select, useConfirm, useToast, type SelectChangeEvent } from 'primevue'
import { ref } from 'vue'

import examples from '@/schema/examples.json'

const widgets = ref(examples)

const confirm = useConfirm()
const toast = useToast()

function onChange(event: SelectChangeEvent) {
  confirm.require({
    message: l10n.value.editor.toolbar.examples.confirm.message,
    header: l10n.value.editor.toolbar.examples.confirm.header,
    rejectProps: {
      label: l10n.value.editor.cancel,
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: l10n.value.editor.choose,
      severity: 'danger',
    },
    accept: () => {
      const path = event.value
      let delLoad = loadingSchemaToast(toast)
      fetch(path)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then((json) => loadSchemaFromJSON(json, toast))
        .catch((error) => {
          console.error('Fetch error:', error)
        })
        .finally(delLoad)
    },
  })
}
</script>

<template>
  <Select :options="widgets" optionLabel="label" optionValue="path" @change="onChange">
    <template #value>
      <i class="pi pi-folder" />
      {{ l10n.editor.toolbar.select_example }}
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
