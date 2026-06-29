<script setup lang="ts">
import type { PropSchema } from '@/schema/widget'
import { InputText, Textarea } from 'primevue'

const props = defineProps<{
  propSchema: PropSchema
}>()
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label :for="propSchema.name" class="font-semibold w-24 text-sm">{{ propSchema.label }}</label>
    <Textarea :id="propSchema.name" class="flex-auto" autocomplete="off" />
  </div>
</template>

<style scoped></style>
