<script setup lang="ts">
import { checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { Checkbox } from 'primevue'
import PartLabel from './parts/PartLabel.vue'

const props = defineProps<{
  propSchema: PropSchema
}>()

const propModel = defineModel<boolean>()

const { isValid } = checkValid([
  {
    model: propModel,
    required: props.propSchema.required,
  },
])

defineExpose({ isValid })
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <PartLabel :prop-schema="propSchema" />
    <Checkbox
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      v-model="propModel"
      binary
      :invalid="!isValid"
    />
  </div>
</template>
