<script setup lang="ts">
import { checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { ColorPicker, Textarea } from 'primevue'
import { ref, watch } from 'vue'
import PartRequired from './parts/PartRequired.vue'
import { SketchPicker } from 'vue-color'
import PartLabel from './parts/PartLabel.vue'

const props = defineProps<{
  propSchema: PropSchema
}>()

const propModel = defineModel<string>({ default: () => '#276def' })

const { isValid } = checkValid([
  {
    model: propModel,
    required: props.propSchema.required,
    validator: (x: string) => x.length > 0,
  },
])
defineExpose({ isValid })

const format = ref('hex')
const formatOptions = [
  { label: 'HEX', value: 'hex' },
  { label: 'RGBA', value: 'rgba' },
  { label: 'HSBA', value: 'hsba' },
  { label: 'HSLA', value: 'hsla' },
  { label: 'OKLCHA', value: 'oklcha' },
]
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <PartLabel :prop-schema="propSchema" />
    <div class="max-w-xs mx-auto space-y-3 w-xs">
      <SketchPicker v-model="propModel" />
    </div>
  </div>
</template>
