<script setup lang="ts">
import { loc } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { Checkbox, InputText, Textarea } from 'primevue'
import { computed } from 'vue'

const props = defineProps<{
  propSchema: PropSchema
}>()

const prop_model = defineModel<boolean>()
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label :for="propSchema.name" class="font-semibold w-24 text-sm">{{
      getVal(loc, propSchema.label, propSchema.name)
    }}</label>
    <Checkbox
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      v-model="prop_model"
      binary
    />
  </div>
</template>

<style scoped></style>
