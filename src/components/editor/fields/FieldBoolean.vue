<script setup lang="ts">
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { Checkbox, InputText, Textarea } from 'primevue'
import { computed } from 'vue'

const props = defineProps<{
  propSchema: PropSchema
}>()

const propModel = defineModel<boolean>()
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label :for="propSchema.name" class="font-semibold w-24 text-sm">
      {{ getVal(l10n, propSchema.label, propSchema.name) }}
    </label>
    <Checkbox
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      v-model="propModel"
      binary
    />
  </div>
</template>

<style scoped></style>
