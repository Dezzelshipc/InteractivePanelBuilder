<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { InputText, InputNumber, Checkbox, Button, Select } from 'primevue'
import { l10n } from '@/localization'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const typeOptions = ref([
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
])

type EntryValue = string | number | boolean

interface Entry {
  id: number
  key: string
  type: string
  value: EntryValue
}

const entries = ref<Entry[]>([])

function createEntry(key = '', type = 'string', value: EntryValue = ''): Entry {
  return {
    id: Date.now() + Math.random(),
    key,
    type,
    value,
  }
}

function initEntries(obj: object) {
  const newEntries = Object.entries(obj).map(([key, val]) => {
    const type = typeof val

    const allowedType =
      type === 'string' || type === 'number' || type === 'boolean' ? type : 'string'
    return createEntry(key, allowedType, val)
  })
  entries.value = newEntries.length ? newEntries : []
}

watch(
  () => props.modelValue,
  (newVal) => {
    const currentObj = getObjectFromEntries()
    if (JSON.stringify(currentObj) !== JSON.stringify(newVal)) {
      initEntries(newVal)
    }
  },
  { immediate: true, deep: true },
)

function getObjectFromEntries() {
  const obj: Record<string, any> = {}
  for (const entry of entries.value) {
    if (entry.key.trim() !== '') {
      let val: EntryValue = entry.value

      if (entry.type === 'number') {
        val = Number(val)
        if (isNaN(val)) val = 0
      } else if (entry.type === 'boolean') {
        val = Boolean(val)
      } else {
        val = String(val)
      }
      obj[entry.key.trim()] = val
    }
  }
  return obj
}

function updateObject() {
  const obj = getObjectFromEntries()
  emit('update:modelValue', obj)
}

function addEntry() {
  entries.value.push(createEntry())
}

function removeEntry(index: number) {
  entries.value.splice(index, 1)

  if (entries.value.length === 0) {
    addEntry()
  }
  updateObject()
}

function onTypeChange(entry: Entry) {
  if (entry.type === 'boolean') {
    entry.value = false
  } else if (entry.type === 'number') {
    entry.value = 0
  } else {
    entry.value = ''
  }
  updateObject()
}

defineExpose({ getObjectFromEntries })
</script>

<template>
  <div class="object-editor">
    <div v-if="entries.length === 0" class="p-text-center p-m-3">No properties defined.</div>

    <div v-for="(entry, index) in entries" :key="entry.id" class="property-row">
      <!-- Key -->
      <div class="field">
        <InputText
          v-model="entry.key"
          placeholder="Property name"
          class="p-inputtext-sm"
          @input="updateObject"
        />
      </div>

      <!-- Type -->
      <div class="field type-field">
        <Select
          v-model="entry.type"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Type"
          class="p-select-sm"
          @change="onTypeChange(entry)"
        />
      </div>

      <!-- Value -->
      <div class="field value-field">
        <InputText
          v-if="entry.type === 'string'"
          v-model="entry.value as string"
          placeholder="String value"
          class="p-inputtext-sm"
          @input="updateObject"
        />
        <InputNumber
          v-else-if="entry.type === 'number'"
          v-model="entry.value as number"
          placeholder="1234567890"
          inputClass="p-inputtext-sm"
          @update:modelValue="updateObject()"
        />
        <div v-else-if="entry.type === 'boolean'" class="boolean-wrapper">
          <Checkbox
            :modelValue="entry.value"
            @update:modelValue="
              (val) => {
                entry.value = val
                updateObject()
              }
            "
            binary
          />
          <span class="boolean-label">{{ entry.value ? 'True' : 'False' }}</span>
        </div>
      </div>

      <Button
        icon="pi pi-times"
        class="p-button-rounded p-button-danger p-button-sm"
        @click="removeEntry(index)"
        :disabled="entries.length === 1 && !entry.key && entry.value === ''"
      />
    </div>

    <Button
      :label="l10n.fields.object.add_property"
      icon="pi pi-plus"
      class="p-button-sm p-button-outlined add-btn"
      @click="addEntry"
    />
  </div>
</template>

<style scoped>
.object-editor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.property-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.field {
  flex: 1.5 1 0;
  min-width: 100px;
}
.type-field {
  flex: 1 1 0;
}
.value-field {
  flex: 1.5 1 0;
}
.boolean-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.boolean-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}
.add-btn {
  align-self: flex-start;
  margin-top: 0.25rem;
}
/* Small screens */
@media (max-width: 600px) {
  .property-row {
    flex-direction: column;
    align-items: stretch;
  }
  .field {
    flex: unset;
  }
  .add-btn {
    align-self: stretch;
  }
}
</style>
