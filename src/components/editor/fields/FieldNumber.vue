<script setup lang="ts">
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { InputNumber, InputText, Textarea } from 'primevue'
import { computed } from 'vue'

const props = defineProps<{
  propSchema: PropSchema
  validator?: (value: number) => boolean
}>()

const propModel = defineModel<number>()

const isInvalid = computed(() => {
  if (!props.propSchema.required) return false
  return propModel.value == null || !props?.validator?.(propModel.value ?? 0)
})

const validate = (): boolean => {
  return !isInvalid.value
}

defineExpose({ validate })
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label :for="propSchema.name" class="font-semibold w-24 text-sm">
      {{ getVal(l10n, propSchema.label, propSchema.name) }}
      <span v-if="propSchema.required" style="color: red" v-tooltip="l10n.editor.required">*</span>
    </label>
    <InputNumber
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      :placeholder="String(props.propSchema.default || 0)"
      v-model="propModel"
      :invalid="isInvalid"
    />
  </div>
</template>
