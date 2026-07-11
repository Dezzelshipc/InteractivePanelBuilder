<script setup lang="ts">
import { checkRequiredTemplate, checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { Button, Divider, Textarea } from 'primevue'
import { ref, watch } from 'vue'
import PartRequired from '../parts/PartRequired.vue'
import { simpleDatasetProps, type SimpleDataset } from '@/components/widgets/simpleChart'
import { fieldsRegistry } from '../fieldsRegistry.ts'
import PartLabel from '../parts/PartLabel.vue'

const props = defineProps<{
  propSchema: PropSchema
}>()

const propModel = defineModel<(SimpleDataset & Record<string, any>)[]>({ required: true })

function addEntry() {
  propModel.value.push({
    label: String(Math.random()).substring(2, 8),
    data: [],
    backgroundColor: '#FF638433',
    borderColor: '#FF6384',
  })
}

function removeEntry(index: number) {
  propModel.value.splice(index, 1)
}

const { arrayRefs, isAll: isSavable } = checkRequiredTemplate('arrayRefsDS')

defineExpose({ isValid: isSavable })
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <PartLabel :prop-schema="propSchema" />
    <div class="flex flex-col items-center gap-4 mb-4">
      <section v-if="propModel.length > 0">
        <Divider />
        <div
          v-for="(dataset, index) in propModel"
          :key="index"
          class="flex flex-row items-center gap-4"
        >
          <div class="flex flex-col items-start gap-4">
            <component
              v-for="propSchema of simpleDatasetProps"
              ref="arrayRefsDS"
              :key="propSchema.name"
              :is="fieldsRegistry.get(propSchema.type, propSchema.name)"
              :prop-schema="propSchema"
              v-model="dataset[propSchema.name]"
            />
            <Divider v-if="index < propModel.length - 1" />
          </div>

          <Button
            icon="pi pi-times"
            rounded
            severity="danger"
            size="small"
            @click="removeEntry(index)"
          />
        </div>
        <Divider />
      </section>
      <Button
        :label="l10n.widgets.simple_chart.add_dataset"
        icon="pi pi-plus"
        size="small"
        variant="outlined"
        class="add-btn"
        @click="addEntry"
      />
    </div>
  </div>
</template>
