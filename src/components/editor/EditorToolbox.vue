<script lang="ts" setup>
import { ref } from 'vue'
import { is_editor } from './editorController'
import { loc } from '@/localization'
import { Button, Checkbox, FileUpload } from 'primevue'
import { panelConfig } from '@/schema'

const is_dev = ref(import.meta.env.DEV)

function saveSchema() {
  let date = new Date()
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - offset * 60 * 1000)
  const dateStr = date.toISOString().replace('T', ' ').split('.')[0]
  const fileName = `schema-${dateStr}`
  console.log(fileName)

  const jsonString = JSON.stringify(panelConfig.value, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="absolute right-2 top-2 flex flex-col gap-1 items-end" v-if="is_dev || is_editor">
    <Checkbox v-model="is_editor" binary />
    <section class="flex flex-col gap-1 items-end opacity-70" v-if="is_editor">
      <div>{{ loc.editor.editor }}</div>
      <Button @click="saveSchema">{{ loc.editor.save }}</Button>
      <FileUpload mode="basic" auto :choose-label="loc.editor.load"></FileUpload>
    </section>
  </div>
</template>

<style scoped></style>
