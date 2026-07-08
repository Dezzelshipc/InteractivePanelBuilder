<script setup lang="ts">
import { checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { Textarea } from 'primevue'

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
    <label :for="propSchema.name" class="font-semibold w-24 text-sm">
      {{ getVal(l10n, propSchema.label, propSchema.name) }}
      <span v-if="propSchema.required" style="color: red" v-tooltip="l10n.editor.required">*</span>
    </label>
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
