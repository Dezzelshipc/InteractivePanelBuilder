<script lang="ts" setup>
import PanelRenderer from './components/renderer/PanelRenderer.vue'
import { loadLocalSchema, panelConfig } from './schema/index.ts'
import EditorToolbox from './components/editor/toolbar/EditorToolbar.vue'

import Toast from 'primevue/toast'
import { onMounted } from 'vue'

onMounted(loadLocalSchema)
</script>

<template>
  <Toast />
  <EditorToolbox />
  <PanelRenderer :config="panelConfig" />
</template>
