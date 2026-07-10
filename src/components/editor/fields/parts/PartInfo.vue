<script setup lang="ts">
import { l10n } from '@/localization'
import { getVal } from '@/utility'

const { info } = defineProps<{ info: string }>()
</script>

<template>
  <span style="color: green" v-tooltip="getVal(l10n, info, `info not defined: ${info}`)">?</span>
</template>
