<script setup lang="ts">
import { l10n } from '@/localization'
import { panelConfig } from '@/schema'
import type { Style } from '@/schema/config'
import { getVal } from '@/utility'
import { Button, Dialog, Textarea } from 'primevue'
import { onMounted, ref, watch } from 'vue'
import FieldObject from './fields/FieldObject.vue'

const props = defineProps<{
  widgetId: string
  widgetClass?: string
  widgetStyle?: Style
}>()

const visible = ref(false)

const localClass = ref<string>('')
const localStyle = ref<Style>({})

function initLocalClass() {
  localClass.value = props.widgetClass || ''
}

function initLocalStyle() {
  localStyle.value = props.widgetStyle || {}
}

watch(visible, (is_visible) => {
  if (is_visible) {
    initLocalClass()
    initLocalStyle()
  }
})

const watchList = [
  [() => props.widgetClass, initLocalClass],
  [() => props.widgetStyle, initLocalStyle],
]

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
    widget.class = localClass.value
    widget.style = { ...localStyle.value }
  }
}
</script>

<template>
  <Button
    class="edit-button"
    icon="pi pi-palette"
    @click="visible = true"
    severity="contrast"
    variant="outlined"
    raised
    v-tooltip="l10n.editor.styles.label"
  />
  <Dialog v-model:visible="visible" modal :header="l10n.editor.edit" :style="{ minWidth: '50rem' }">
    <div class="flex items-center gap-4 mb-4">
      <label for="style_class" class="font-semibold w-24 text-sm">
        {{ l10n.editor.styles.class }}
      </label>
      <Textarea id="style_class" class="flex-auto" autocomplete="off" v-model="localClass" />
    </div>

    <div class="flex items-center gap-4 mb-4">
      <label for="style_style" class="font-semibold w-24 text-sm">
        {{ l10n.editor.styles.style }}
      </label>
      <FieldObject id="style_style" v-model="localStyle" />
      <pre class="style-object">{{ localStyle }}</pre>
    </div>

    <template #footer>
      <Button severity="secondary" variant="outlined" @click="visible = false">
        {{ l10n.editor.cancel }}
      </Button>
      <Button @click="buttonSave">{{ l10n.editor.apply }}</Button>
    </template>
  </Dialog>
</template>

<style scoped>
.style-object {
  border: 1px dashed #0003;
  padding: 4px;
  border-radius: 10px;
}
</style>
