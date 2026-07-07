<script lang="ts" setup>
import PanelRenderer from './components/renderer/PanelRenderer.vue'
import { loadLocalSchema } from './schema/index.ts'
import EditorToolbox from './components/editor/toolbar/EditorToolbar.vue'

import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { onMounted } from 'vue'

onMounted(loadLocalSchema)
</script>

<template>
  <ConfirmDialog />
  <Toast />
  <EditorToolbox />
  <PanelRenderer />
</template>
