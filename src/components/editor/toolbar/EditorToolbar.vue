<script lang="ts" setup>
import { onMounted } from 'vue'
import { editorMode, isEditorMode, isPanelMode, setPanelMode } from '../editorController.ts'
import { l10n } from '@/localization'
import { Button, Checkbox, Toolbar } from 'primevue'
import SchemaUploader from './SchemaUploader.vue'

onMounted(async () => {
  import('../GenericWidgetEditor.vue')
})
</script>

<template>
  <Toolbar v-if="isEditorMode">
    <template #start>
      <div>{{ l10n.editor.toolbar.add_widget }}*</div>
      <div>{{ l10n.editor.toolbar.edit_panel_style }}*</div>
    </template>

    <template #center>
      <SchemaUploader />
    </template>

    <template #end>
      <Button @click="setPanelMode(true)" severity="danger" rounded>
        <i class="pi pi-caret-right" />
        {{ l10n.editor.toolbar.start_panel }}
      </Button>
    </template>
  </Toolbar>
  <div class="absolute right-2 top-2" :style="{ zIndex: 1000 }" v-if="!isPanelMode">
    <Checkbox v-model="editorMode" binary />
  </div>
</template>

<style scoped></style>
