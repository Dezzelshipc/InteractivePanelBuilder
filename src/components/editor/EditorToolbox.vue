<script lang="ts" setup>
import { ref } from 'vue'
import { is_editor } from './editorController'
import { loc } from '@/localization'
import { Button, Checkbox, FileUpload, type FileUploadSelectEvent } from 'primevue'
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

function uploadSchema(event: FileUploadSelectEvent) {
  const file = event.files[0] as File
  if (!file) return

  const onUpload = (text: string, badge: string) => {
    const pending = document.getElementsByClassName(
      'p-badge p-badge-warn p-fileupload-file-badge',
    )?.[0]
    if (pending) {
      pending.innerHTML = text
      pending.classList.remove('p-fileupload-file-badge')
      pending.classList.replace('p-badge-warn', badge)
    }
    return pending
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string)
      panelConfig.value = json
      console.log('Schema loaded:', json)
      onUpload('Completed', 'p-badge-ok')
    } catch (err) {
      console.error('Invalid JSON file', err)
      onUpload('Fail', 'p-badge-danger')
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="absolute right-2 top-2 flex flex-col gap-1 items-end" v-if="is_dev || is_editor">
    <Checkbox v-model="is_editor" binary />
    <section class="flex flex-col gap-1 items-end opacity-70" v-if="is_editor">
      <div>{{ loc.editor.editor }}</div>
      <Button @click="saveSchema">{{ loc.editor.save }}</Button>
      <FileUpload
        mode="advanced"
        :multiple="false"
        :show-upload-button="false"
        :file-limit="1"
        accept=".json"
        auto
        :choose-label="loc.editor.choose"
        :upload-label="loc.editor.upload"
        :cancel-label="loc.editor.cancel"
        @select="uploadSchema"
        :pt="{
          fileThumbnail: { style: { display: 'none' } },
        }"
        ><template #empty>
          <div>{{ loc.editor.dragdrop_upload }}</div>
        </template></FileUpload
      >
    </section>
  </div>
</template>

<style scoped></style>
