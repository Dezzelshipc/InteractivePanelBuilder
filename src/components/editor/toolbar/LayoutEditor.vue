<script setup lang="ts">
import { l10n } from '@/localization'
import { panelConfig, saveLocalSchema } from '@/schema'
import { propSchemaLayout, propWebSocketServer } from '@/schema/config'
import { Button, Dialog, Divider } from 'primevue'
import { ref } from 'vue'
import FieldsClassStyle from '../fields/FieldsClassStyle.vue'
import FieldNumber from '../fields/FieldNumber.vue'
import { checkRequiredArray } from '@/composable/checkRequired.ts'
import { useDialogSave } from '@/composable/useDialogSave.ts'
import FieldString from '../fields/FieldString.vue'

const visible = ref(false)

const webSocketServer = ref()

const { arrayRefs, isAll: isSavable } = checkRequiredArray(2)

const grThanZero = (x: number) => x > 0

function onSave() {
  if (isSavable.value) {
    panelConfig.value.webSocketServer = webSocketServer.value
    saveLocalSchema()
  }
}

const { onHideDialog, onShowDialog, onSaveButton } = useDialogSave({
  isVisible: visible,
  modelProps: [panelConfig],
  onSave,
  onShow: () => (webSocketServer.value = panelConfig.value.webSocketServer),
})
</script>

<template>
  <Button
    class="edit-button"
    icon="pi pi-palette"
    :label="l10n.editor.toolbar.edit_panel"
    @click="visible = true"
    severity="primary"
  />

  <Dialog
    v-model:visible="visible"
    :header="l10n.editor.edit"
    modal
    draggable
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
    <label class="font-semibold text-sm mb-4">{{ l10n.editor.layout.grid_info }}</label>
    <FieldNumber
      :ref="arrayRefs[0]"
      v-model="panelConfig.layout.columns"
      :prop-schema="propSchemaLayout.columns"
      :validator="grThanZero"
    />
    <FieldNumber
      :ref="arrayRefs[1]"
      v-model="panelConfig.layout.rows"
      :prop-schema="propSchemaLayout.rows"
      :validator="grThanZero"
    />
    <FieldNumber v-model="panelConfig.layout.gap" :prop-schema="propSchemaLayout.gap" />

    <Divider />

    <FieldString v-model="webSocketServer" :prop-schema="propWebSocketServer" />

    <Divider />

    <FieldsClassStyle
      v-model:class="panelConfig.layout.class"
      v-model:style="panelConfig.layout.style"
    />
    <template #footer>
      <Button severity="secondary" variant="outlined" @click="visible = false">
        {{ l10n.editor.cancel }}
      </Button>
      <Button @click="onSaveButton" :disabled="!isSavable">{{ l10n.editor.apply }}</Button>
    </template>
  </Dialog>
</template>
