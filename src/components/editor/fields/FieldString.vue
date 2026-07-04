<script setup lang="ts">
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { InputText, Textarea } from 'primevue'
import { computed } from 'vue'

const props = defineProps<{
  propSchema: PropSchema
}>()

const prop_model = defineModel<string>()
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label :for="propSchema.name" class="font-semibold w-24 text-sm">
      {{ getVal(l10n, propSchema.label, propSchema.name) }}
    </label>
    <Textarea
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      :placeholder="getVal(l10n, props.propSchema.default, '')"
      v-model="prop_model"
    />
  </div>
</template>

<style scoped></style>
