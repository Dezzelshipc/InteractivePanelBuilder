<script setup lang="ts">
import { l10n } from '@/localization'
import { panelConfig, saveLocalSchema } from '@/schema'
import { propWidgetPosition, type WidgetPosition, type Style } from '@/schema/config'
import { Button, Dialog, Divider, useConfirm } from 'primevue'
import { ref } from 'vue'
import FieldsClassStyle from './fields/FieldsClassStyle.vue'
import { checkRequiredArray } from '@/composable/checkRequired.ts'
import FieldNumber from './fields/FieldNumber.vue'
import { useDialogSave } from '@/composable/useDialogSave.ts'
import { getVal } from '@/utility/index.ts'

const props = defineProps<{
  widgetId: string
}>()

const visible = ref(false)

const localClass = defineModel<string>('class')
const localStyle = defineModel<Style>('style')

const localPosition = defineModel<WidgetPosition>('pos', { required: true })
const { arrayRefs, isAll: isSavable } = checkRequiredArray(4)

const notNegNum = (x: number) => x >= 0
const isPosNum = (x: number) => x > 0

function onSave() {
  if (isSavable.value) saveLocalSchema()
}

const { onHideDialog, onShowDialog, onSaveButton } = useDialogSave({
  isVisible: visible,
  modelProps: [localClass, localStyle, localPosition],
  onSave,
})

const confirm = useConfirm()

const removeConfirm = () => {
  confirm.require({
    message: l10n.value.editor.styles.remove_widget.message,
    header: l10n.value.editor.styles.remove_widget.header,
    rejectProps: {
      label: l10n.value.editor.cancel,
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: l10n.value.editor.remove,
      severity: 'danger',
    },
    accept: () => {
      visible.value = false
      delete panelConfig.value.widgets[props.widgetId]
      saveLocalSchema()
    },
  })
}
</script>

<template>
  <Button
    class="edit-button"
    icon="pi pi-palette"
    @click="visible = true"
    severity="info"
    raised
    v-tooltip="l10n.editor.styles.label"
  />
  <Dialog
    v-model:visible="visible"
    modal
    draggable
    maximizable
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
    <FieldNumber
      :ref="arrayRefs[0]"
      v-model="localPosition.x"
      :prop-schema="propWidgetPosition.x"
      :validator="notNegNum"
    />
    <FieldNumber
      :ref="arrayRefs[1]"
      v-model="localPosition.y"
      :prop-schema="propWidgetPosition.y"
      :validator="notNegNum"
    />
    <FieldNumber
      :ref="arrayRefs[2]"
      v-model="localPosition.w"
      :prop-schema="propWidgetPosition.w"
      :validator="isPosNum"
    />
    <FieldNumber
      :ref="arrayRefs[3]"
      v-model="localPosition.h"
      :prop-schema="propWidgetPosition.h"
      :validator="isPosNum"
    />

    <Divider />

    <FieldsClassStyle v-model:class="localClass" v-model:style="localStyle" />
    <template #footer>
      <Button
        @click="removeConfirm()"
        severity="danger"
        variant="outlined"
        :label="l10n.editor.remove"
      />
      <Button
        @click="visible = false"
        severity="secondary"
        variant="outlined"
        :label="l10n.editor.cancel"
      />
      <Button @click="onSaveButton" :disabled="!isSavable" :label="l10n.editor.apply" />
    </template>
  </Dialog>
</template>
