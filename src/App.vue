<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'
import { get_default_panel_config, type PanelConfig } from '@/schema/config.ts'
import PanelRenderer from './components/renderer/PanelRenderer.vue'
import { Checkbox } from 'primevue'
import { is_editor } from './components/editor/editorController.ts'

const panelConfig = ref(get_default_panel_config())

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

const is_dev = ref(import.meta.env.DEV)
console.log(is_dev)
</script>

<template>
  <div class="absolute right-2 top-2" v-if="is_dev">
    <Checkbox v-model="is_editor" binary />
  </div>
  <PanelRenderer :config="panelConfig" />
</template>
