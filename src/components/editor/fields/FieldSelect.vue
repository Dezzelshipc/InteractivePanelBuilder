<script setup lang="ts">
import { checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { Select } from 'primevue'

const props = defineProps<{
  propSchema: PropSchema
}>()

const propModel = defineModel()

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
    <Select
      v-model="propModel"
      :options="props.propSchema.options"
      checkmark
      option-label="label"
      option-value="value"
      :pt="{ option: { class: 'flex-row-reverse justify-between' } }"
      :invalid="!isValid"
    >
      <template #value="slotProps">
        <div class="flex items-center gap-2">
          <i :class="propSchema.options?.[slotProps.value]?.icon" />
          <span>
            {{ getVal(l10n, propSchema.options?.[slotProps.value]?.label, slotProps.value) }}
          </span>
        </div>
      </template>
      <template #option="slotProps">
        <div class="flex items-center gap-3 py-1">
          <i :class="[slotProps.option.icon]" />
          <div class="flex flex-col">
            <span class="font-medium">{{ getVal(l10n, slotProps.option.label, '') }}</span>
            <span class="text-xs text-surface-500">{{ slotProps.option.description }}</span>
          </div>
        </div>
      </template>
    </Select>
  </div>
</template>
