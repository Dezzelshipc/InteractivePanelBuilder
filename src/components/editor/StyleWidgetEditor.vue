<script setup lang="ts">
import { l10n } from '@/localization'
import { panelConfig, saveLocalSchema } from '@/schema'
import type { Style } from '@/schema/config'
import { Button, Dialog } from 'primevue'
import { onMounted, ref, watch } from 'vue'
import FieldsClassStyle from './fields/FieldsClassStyle.vue'

const props = defineProps<{
  widgetId: string
}>()

const visible = ref(false)

const localClass = defineModel<string>('class')
const localStyle = defineModel<Style>('style')

function buttonSave() {
  saveLocalSchema()
  visible.value = false
}
</script>

<template>
  <Button
    class="edit-button"
    icon="pi pi-palette"
    @click="visible = true"
    severity="contrast"
    variant="outlined"
    raised
    v-tooltip="l10n.editor.styles.label"
  />
  <Dialog
    v-model:visible="visible"
    modal
    draggable
    :header="l10n.editor.edit"
    :style="{ minWidth: '50rem' }"
    :pt="{
      root: { style: { 'box-shadow': 'gray 0px 0px 1em 0.1em' } },
      header: { class: 'cursor-move' },
      mask: { style: { 'background-color': '#0000 !important' } },
    }"
  >
    <FieldsClassStyle v-model:class="localClass" v-model:style="localStyle" />
    <template #footer>
      <Button severity="secondary" variant="outlined" @click="visible = false">
        {{ l10n.editor.cancel }}
      </Button>
      <Button @click="buttonSave">{{ l10n.editor.apply }}</Button>
    </template>
  </Dialog>
</template>
