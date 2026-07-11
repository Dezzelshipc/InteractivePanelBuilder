<script setup lang="ts">
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import PartInfo from './PartInfo.vue'
import PartRequired from './PartRequired.vue'

const { propSchema } = defineProps<{ propSchema: PropSchema }>()
</script>

<template>
  <label :for="propSchema.name" class="font-semibold w-30 text-sm">
    {{ getVal(l10n, propSchema.label, propSchema.name) }}
    <PartRequired v-if="propSchema.required" />
    <PartInfo v-if="propSchema.info" :info="propSchema.info" />
  </label>
</template>
