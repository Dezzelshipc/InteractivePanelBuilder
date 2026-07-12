<script setup lang="ts">
import { l10n } from '@/localization'
import type { Style } from '@/schema/config'
import { Textarea } from 'primevue'
import FieldObject from './FieldObject.vue'
import type { PropSchema } from '@/schema/widget.ts'
import { getVal } from '@/utility/index.ts'
import PartLabel from './parts/PartLabel.vue'

const { propClass, propStyle } = defineProps<{ propClass?: PropSchema; propStyle?: PropSchema }>()

const localClass = defineModel<string>('class')
const localStyle = defineModel<Style>('style')
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label for="style_class" class="font-semibold w-24 text-sm">
      {{ getVal(l10n, propClass?.label, l10n.editor.styles.class) }}
    </label>
    <Textarea id="style_class" class="flex-auto" autocomplete="off" v-model="localClass" />
  </div>

  <div class="flex items-center gap-4 mb-4">
    <label for="style_style" class="font-semibold w-24 text-sm">
      {{ getVal(l10n, propStyle?.label, l10n.editor.styles.style) }}
    </label>
    <FieldObject id="style_style" v-model="localStyle" />
    <pre class="style-object">{{ localStyle }}</pre>
  </div>
</template>

<style scoped>
.style-object {
  border: 1px dashed #0003;
  padding: 4px;
  border-radius: 10px;

  max-width: 30vw;
  max-height: 80vh;
  overflow: auto;
}
</style>
