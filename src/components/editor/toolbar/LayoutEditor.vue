<script setup lang="ts">
import { l10n } from '@/localization'
import { loadLocalSchema, panelConfig, saveLocalSchema } from '@/schema'
import { propSchemaLayout, type LayoutConfig, type Style } from '@/schema/config'
import { Button, Dialog } from 'primevue'
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import FieldsClassStyle from '../fields/FieldsClassStyle.vue'
import FieldNumber from '../fields/FieldNumber.vue'
import { checkRequired } from '@/composable/checkRequired.ts'

const visible = ref(false)

const { arrayRefs, isAll: isSavable } = checkRequired({ amount: 2 })

const grThanZero = (x: number) => x > 0

function buttonSave() {
  if (isSavable.value) {
    saveLocalSchema()
    visible.value = false
  }
}
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
      header: { class: 'cursor-move' },
      mask: { style: { 'background-color': '#0000 !important' } },
    }"
    @hide="loadLocalSchema"
  >
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

    <FieldsClassStyle
      v-model:class="panelConfig.layout.class"
      v-model:style="panelConfig.layout.style"
    />
    <template #footer>
      <Button severity="secondary" variant="outlined" @click="visible = false">
        {{ l10n.editor.cancel }}
      </Button>
      <Button @click="buttonSave" :disabled="!isSavable">{{ l10n.editor.apply }}</Button>
    </template>
  </Dialog>
</template>
