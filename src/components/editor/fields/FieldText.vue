<script setup lang="ts">
import { checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { Textarea } from 'primevue'
import PartLabel from './parts/PartLabel.vue'

const props = defineProps<{
  propSchema: PropSchema
  validator?: (value: string) => boolean
}>()

const propModel = defineModel<string>()

const { isValid } = checkValid([
  {
    model: propModel,
    required: props.propSchema.required,
    validator: props.validator ?? ((x: string) => x.length > 0),
  },
])

defineExpose({ isValid })
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <PartLabel :prop-schema="propSchema" />
    <Textarea
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      :placeholder="getVal(l10n, props.propSchema.default, '')"
      v-model="propModel"
      :invalid="!isValid"
    />
  </div>
</template>
