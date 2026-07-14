<script lang="ts" setup>
import PanelRenderer from './components/renderer/PanelRenderer.vue'
import { loadLocalSchema } from './schema/index.ts'
import EditorToolbox from './components/editor/toolbar/EditorToolbar.vue'

import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { onMounted } from 'vue'
import { registerWidgets } from './components/widgets/widgetRegistry.ts'

onMounted(loadLocalSchema)
onMounted(registerWidgets)
</script>

<template>
  <ConfirmDialog
    :pt="{
      message: { class: 'whitespace-pre-line' },
    }"
  />
  <Toast
    :pt="{
      message: { class: 'whitespace-pre-line' },
    }"
  />
  <EditorToolbox />
  <PanelRenderer />
</template>
