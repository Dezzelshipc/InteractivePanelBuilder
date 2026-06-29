<script setup lang="ts">
import type { PropSchema } from '@/schema/widget'
import { Button, Dialog } from 'primevue'
import { ref } from 'vue'
import { fieldsRegistry } from './fields/fieldsRegistry'

const props = defineProps<{
  widgetProps: object
  propSchemas: PropSchema[]
}>()

const visible = ref(false)

function updateConfig() {}
</script>

<template>
  <Button class="edit-button" @click="visible = true">Edit</Button>
  <Dialog v-model:visible="visible" modal header="Edit" :style="{ minWidth: '50rem' }">
    <component
      v-for="propSchema in propSchemas"
      :is="fieldsRegistry.get(propSchema.type)"
      :prop-schema="propSchema"
    />
    <template #footer>
      <Button severity="secondary" variant="outlined" @click="visible = false">Cancel</Button>
      <Button @click="visible = false">Save</Button>
    </template>
  </Dialog>
</template>

<style scoped>
.edit-button {
  position: relative;
  float: right;
}
</style>
