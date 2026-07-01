<script setup lang="ts">
import type { PropSchema } from '@/schema/widget'
import { Button, Dialog } from 'primevue'
import { computed, onMounted, ref, watch } from 'vue'
import { fieldsRegistry } from './fields/fieldsRegistry'
import { loc } from '@/localization'
import { panelConfig } from '@/schema'

const props = defineProps<{
  widgetId: string
  widgetProps: Record<string, any>
  propSchemas: PropSchema[]
}>()

const visible = ref(false)

const localProps = ref<Record<string, any>>({})

function initLocalProps() {
  const initial: Record<string, any> = {}
  for (const schema of props.propSchemas) {
    initial[schema.name] = props.widgetProps?.[schema.name]
  }
  localProps.value = initial
}

watch(visible, (is_visible) => {
  if (is_visible) {
    initLocalProps()
  }
})

watch(
  () => props.widgetProps,
  () => {
    if (!visible.value) {
      initLocalProps()
    }
  },
  { deep: true },
)

onMounted(initLocalProps)

function buttonSave() {
  updateConfig()
  visible.value = false
}

function updateConfig() {
  const widget = panelConfig.value.widgets[props.widgetId]
  if (widget) {
    widget.props = { ...localProps.value }
  }
}
</script>

<template>
  <Button class="edit-button" @click="visible = true">{{ loc.editor.edit_icon }}</Button>
  <Dialog v-model:visible="visible" modal :header="loc.editor.edit" :style="{ minWidth: '50rem' }">
    <component
      v-for="propSchema in propSchemas"
      :key="propSchema.name"
      :is="fieldsRegistry.get(propSchema.type)"
      :prop-schema="propSchema"
      v-model="localProps[propSchema.name]"
    />
    <template #footer>
      <Button severity="secondary" variant="outlined" @click="visible = false">{{
        loc.editor.cancel
      }}</Button>
      <Button @click="buttonSave()">{{ loc.editor.apply }}</Button>
    </template>
  </Dialog>
</template>

<style scoped>
.edit-button {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0.7;
}
</style>
