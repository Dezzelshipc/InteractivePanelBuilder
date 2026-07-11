<script setup lang="ts">
import { checkValid } from '@/composable/checkRequired'
import { l10n } from '@/localization'
import type { PropSchema, WebSocketConfig } from '@/schema/widget'
import { getVal } from '@/utility'
import { InputText } from 'primevue'
import PartRequired from './parts/PartRequired.vue'
import PartInfo from './parts/PartInfo.vue'
import { ref, watch } from 'vue'
import PartLabel from './parts/PartLabel.vue'

const props = defineProps<{
  propSchema: PropSchema
}>()

const propModel = defineModel<WebSocketConfig | null>({ required: true })

const url = ref<string>('')
const topic = ref<string>('')

if (propModel.value) {
  url.value = propModel.value.url
  topic.value = propModel.value.topic
} else {
  propModel.value = {
    url: '',
    topic: '',
  }
}

watch(url, (newURL) => {
  if (propModel.value) {
    propModel.value.url = newURL
  }
})

watch(topic, (newTopic) => {
  if (propModel.value) {
    propModel.value.topic = newTopic
  }
})

const { isValid } = checkValid([
  {
    model: propModel,
    required: props.propSchema.required !== false, // work with undefined
    validator: (x: WebSocketConfig) => !!((x.topic && x.url) || (!x.topic && !x.url)),
  },
])

defineExpose({ isValid })
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <PartLabel :prop-schema="propSchema" />
    <InputText
      :id="propSchema.name"
      class="flex-auto"
      autocomplete="off"
      v-model="url"
      :invalid="!isValid"
    />

    <label :for="propSchema.name + 2" class="font-semibold w-24 text-sm">
      {{ getVal(l10n, propSchema.additional?.label2, propSchema.name + ' @additional.label2') }}
    </label>
    <InputText
      :id="propSchema.name + 2"
      class="flex-auto"
      autocomplete="off"
      v-model="topic"
      :invalid="!isValid"
    />
  </div>
</template>
