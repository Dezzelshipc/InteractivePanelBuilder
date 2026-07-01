<script setup lang="ts">
import { loc } from '@/localization'
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
    <label :for="propSchema.name" class="font-semibold w-24 text-sm">{{
      getVal(loc, propSchema.label, propSchema.name)
    }}</label>
    <Textarea
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      :placeholder="getVal(loc, props.propSchema.default, '')"
      v-model="prop_model"
    />
  </div>
</template>

<style scoped></style>
