<script setup lang="ts">
import type { PropSchema } from '@/schema/widget'
import { Button, Dialog } from 'primevue'
import { computed, onMounted, ref, watch } from 'vue'
import { fieldsRegistry } from './fields/fieldsRegistry'
import { l10n } from '@/localization'
import { panelConfig, saveLocalSchema } from '@/schema'
import type { Style } from '@/schema/config'

const props = defineProps<{
  widgetId: string
  propSchemas: PropSchema[]
}>()

const visible = ref(false)

const localProps = defineModel<Record<string, any>>('widgetProps', {
  default: () => {
    return {}
  },
})

function buttonSave() {
  updateConfig()
  visible.value = false
}

function updateConfig() {
  const widget = panelConfig.value.widgets[props.widgetId]
  if (widget) {
    widget.props = { ...localProps.value }
    saveLocalSchema()
  }
}
</script>

<template>
  <Button
    class="edit-button"
    icon="pi pi-cog"
    @click="visible = true"
    severity="contrast"
    variant="outlined"
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
      header: { class: 'cursor-move' },
      mask: { style: { 'background-color': '#0000 !important' } },
    }"
  >
    <component
      v-for="propSchema in propSchemas"
      :key="propSchema.name"
      :is="fieldsRegistry.get(propSchema.type)"
      :prop-schema="propSchema"
      v-model="localProps[propSchema.name]"
    />
    <template #footer>
      <Button severity="secondary" variant="outlined" @click="visible = false">
        {{ l10n.editor.cancel }}
      </Button>
      <Button @click="buttonSave">{{ l10n.editor.apply }}</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>
