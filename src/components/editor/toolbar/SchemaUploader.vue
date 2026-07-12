<script setup lang="ts">
import { l10n } from '@/localization'
import { loadSchemaFromString, saveSchemaToFile } from '@/schema'
import { Button, FileUpload, useToast, type FileUploadSelectEvent } from 'primevue'
import { ref } from 'vue'

const toast = useToast()

function uploadSchema(event: FileUploadSelectEvent) {
  const file = event.files[0] as File
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    loadSchemaFromString(e.target?.result as string, toast)
    fu.value.clear()
  }
  reader.readAsText(file)
}

const fu = ref()

const onChoose = () => {
  fu.value.choose()
}
</script>

<template>
  <section class="flex flex-row gap-2 items-center">
    <FileUpload
      ref="fu"
      name="demo[]"
      mode="advanced"
      :pt="{
        root: {
          class: 'cursor-pointer',
          style: { maxHeight: 'min-content', maxWidth: '20em', textAlign: 'center' },
        },
        header: { class: 'hidden!' },
        fileThumbnail: { style: { display: 'none' } },
      }"
      :multiple="false"
      :file-limit="1"
      accept=".json"
      auto
      @select="uploadSchema"
      @click="onChoose"
    >
      <template #content>
        <div class="flex items-center pt-3">
          <i class="pi pi-download" />
          <div class="text-sm font-medium">
            {{ l10n.editor.toolbar.dragdrop_upload }}
          </div>
        </div>
      </template>
    </FileUpload>

    <Button icon="pi pi-save" @click="saveSchemaToFile" :label="l10n.editor.toolbar.save_schema" />
  </section>
</template>
