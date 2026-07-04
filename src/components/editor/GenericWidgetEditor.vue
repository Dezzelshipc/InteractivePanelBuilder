<script setup lang="ts">
import type { PropSchema } from '@/schema/widget'
import { Button, Dialog } from 'primevue'
import { computed, onMounted, ref, watch } from 'vue'
import { fieldsRegistry } from './fields/fieldsRegistry'
import { l10n } from '@/localization'
import { panelConfig } from '@/schema'
import type { Style } from '@/schema/config'

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

const watchList = [[() => props.widgetProps, initLocalProps]]

for (const [w, f] of watchList) {
  if (!w || !f) continue
  watch(w, () => !visible.value && f(), { deep: true })

  onMounted(f)
}

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
  <Button
    class="edit-button"
    icon="pi pi-cog"
    @click="visible = true"
    severity="contrast"
    variant="outlined"
    raised
    v-tooltip="l10n.editor.props.label"
  />
  <Dialog v-model:visible="visible" modal :header="l10n.editor.edit" :style="{ minWidth: '50rem' }">
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
