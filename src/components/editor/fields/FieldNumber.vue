<script setup lang="ts">
import { checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { InputNumber } from 'primevue'
import PartLabel from './parts/PartLabel.vue'

const props = defineProps<{
  propSchema: PropSchema
  validator?: (value: number) => boolean
}>()

const propModel = defineModel<number>()

const { isValid } = checkValid([
  {
    model: propModel,
    required: props.propSchema.required,
    validator: props.validator,
  },
])

defineExpose({ isValid })
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <PartLabel :prop-schema="propSchema" />
    <InputNumber
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      :placeholder="String(props.propSchema.default || 0)"
      v-model="propModel"
      :invalid="!isValid"
    />
  </div>
</template>
