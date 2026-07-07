<script setup lang="ts">
import { checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { Checkbox } from 'primevue'

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
    <label :for="propSchema.name" class="font-semibold w-24 text-sm">
      {{ getVal(l10n, propSchema.label, propSchema.name) }}
      <span v-if="propSchema.required" style="color: red" v-tooltip="l10n.editor.required">*</span>
    </label>
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
