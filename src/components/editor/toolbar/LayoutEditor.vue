<script setup lang="ts">
import { l10n } from '@/localization'
import { panelConfig, saveLocalSchema } from '@/schema'
import { type LayoutConfig, type Style } from '@/schema/config'
import { Button, Dialog } from 'primevue'
import { onMounted, ref, watch } from 'vue'
import FieldsClassStyle from '../fields/FieldsClassStyle.vue'

const visible = ref(false)

const localLayout = ref<LayoutConfig>(panelConfig.value.layout)

function buttonSave() {
  updateConfig()
  visible.value = false
}

function updateConfig() {
  if (localLayout.value) {
    panelConfig.value.layout = localLayout.value
    saveLocalSchema()
  }
}
</script>

<template>
  <Button
    class="edit-button"
    icon="pi pi-palette"
    :label="l10n.editor.toolbar.edit_panel"
    @click="visible = true"
    severity="contrast"
    variant="outlined"
    raised
  />
  <Dialog v-model:visible="visible" modal :header="l10n.editor.edit" :style="{ minWidth: '50rem' }">
    <FieldsClassStyle v-model:class="localLayout.class" v-model:style="localLayout.style" />
    <template #footer>
      <Button severity="secondary" variant="outlined" @click="visible = false">
        {{ l10n.editor.cancel }}
      </Button>
      <Button @click="buttonSave">{{ l10n.editor.apply }}</Button>
    </template>
  </Dialog>
</template>
