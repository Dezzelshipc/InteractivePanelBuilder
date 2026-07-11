<script setup lang="ts">
import { checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'
import { getVal } from '@/utility'
import { Textarea } from 'primevue'
import { ref, watch } from 'vue'
import PartLabel from './parts/PartLabel.vue'

const props = defineProps<{
  propSchema: PropSchema
}>()

function validator(x: string) {
  if (x.length < 2) return false
  if (x[0] !== '{' && x[x.length - 1] !== '}') return false
  try {
    JSON.parse(x)
  } catch (e) {
    return false
  }
  return true
}

const propModel = defineModel<Record<string, any>>()

const stringInner = ref<string>(JSON.stringify(propModel.value ?? {}, null, 2))

const { isValid } = checkValid([
  {
    model: stringInner,
    required: props.propSchema.required !== false,
    validator: validator,
  },
])

watch(stringInner, (str) => {
  if (validator(str)) propModel.value = JSON.parse(str)
  else if (str === '') stringInner.value = '{}'
  else propModel.value = {}
})

defineExpose({ isValid })
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <PartLabel :prop-schema="propSchema" />
    <Textarea
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      :placeholder="getVal(l10n, props.propSchema.default, props.propSchema.default)"
      v-model="stringInner"
      :invalid="!isValid"
    />
    <pre class="style-object">{{ propModel }}</pre>
  </div>
</template>

<style scoped>
.style-object {
  border: 1px dashed #0003;
  padding: 4px;
  border-radius: 10px;

  max-height: 50vh;
  overflow: auto;
}
</style>
