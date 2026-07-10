<script setup lang="ts">
import type { PropSchema } from '@/schema/widget'
import { Button, Dialog } from 'primevue'
import { ref } from 'vue'
import { fieldsRegistry } from './fields/fieldsRegistry'
import { l10n } from '@/localization'
import { panelConfig, saveLocalSchema } from '@/schema'
import { useDialogSave } from '@/composable/useDialogSave'
import { checkRequiredTemplate } from '@/composable/checkRequired'

const props = defineProps<{
  widgetId: string
  propSchemas: PropSchema[]
}>()

const visible = ref(false)

const { arrayRefs, isAll: isSavable } = checkRequiredTemplate('arrayRefs')

const localProps = defineModel<Record<string, any>>('widgetProps', { required: true })

function cleanDataSource() {
  for (const v of props.propSchemas) {
    const k = v.name
    const ds = localProps.value[k]
    if (v.type === 'dataSource' && ds && (!ds['url'] || !ds['topic'])) {
      localProps.value[k] = null
    }
  }
}

function onSave() {
  cleanDataSource()
  if (panelConfig.value.widgets[props.widgetId] && isSavable.value) saveLocalSchema()
}

const { onHideDialog, onShowDialog, onSaveButton } = useDialogSave({
  isVisible: visible,
  modelProps: [localProps],
  onSave,
})
</script>

<template>
  <Button
    class="edit-button"
    icon="pi pi-cog"
    @click="visible = true"
    severity="info"
    raised
    v-tooltip="l10n.editor.props.label"
  />
  <Dialog
    v-model:visible="visible"
    modal
    draggable
    :header="l10n.editor.edit"
    :style="{ minWidth: '50rem' }"
    :pt="{
      root: { style: { 'box-shadow': 'gray 0px 0px 1em 0.1em' } },
      content: { class: 'flex flex-col' },
      header: { class: 'cursor-move' },
      mask: { style: { 'background-color': '#0000 !important' } },
    }"
    @hide="onHideDialog"
    @show="onShowDialog"
  >
    <component
      v-for="propSchema of propSchemas"
      ref="arrayRefs"
      :key="propSchema.name"
      :is="fieldsRegistry.get(propSchema.type)"
      :prop-schema="propSchema"
      v-model="localProps[propSchema.name]"
    />
    <template #footer>
      <Button severity="secondary" variant="outlined" @click="visible = false">
        {{ l10n.editor.cancel }}
      </Button>
      <Button @click="onSaveButton" :disabled="!isSavable">
        {{ l10n.editor.apply }}
      </Button>
    </template>
  </Dialog>
</template>
