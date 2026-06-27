<script setup lang="ts">
import type { Position } from '@/schema/schema'

defineProps<{
  position: Position
}>()
</script>

<template>
  <div
    class="grid-item"
    :style="`grid-area: ${position.y + 1} / ${position.x + 1} / span ${position.h} / span ${position.w};`"
  >
    <slot /> {{ position }}
  </div>
</template>

<style scoped></style>
