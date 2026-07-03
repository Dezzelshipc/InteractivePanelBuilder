<script lang="ts" setup>
import PanelRenderer from './components/renderer/PanelRenderer.vue'
import { panelConfig } from './schema/index.ts'
import EditorToolbox from './components/editor/EditorToolbox.vue'

import Toast from 'primevue/toast'

// onMounted(() => {
fetch('/examples/simple.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return response.json()
  })
  .then((jsonContent) => {
    panelConfig.value = jsonContent
    // console.log(jsonContent)
  })
  .catch((error) => {
    console.error('Fetch error:', error)
  })
// })
</script>

<template>
  <Toast />
  <EditorToolbox />
  <PanelRenderer :config="panelConfig" />
</template>
