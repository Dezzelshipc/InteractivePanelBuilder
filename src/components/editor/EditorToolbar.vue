<script lang="ts" setup>
import { h, markRaw, onMounted, ref } from 'vue'
import {
  editorMode,
  isEditorMode,
  isPanelMode,
  setEditorMode,
  setPanelMode,
} from './editorController.ts'
import { l10n } from '@/localization'
import { Button, Checkbox, FileUpload, Toolbar, type FileUploadSelectEvent } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { panelConfig } from '@/schema'
import { configValidator } from '@/schema/configValidator.ts'
import type { PanelConfig } from '@/schema/config.ts'

onMounted(async () => {
  import('./GenericWidgetEditor.vue')
})

const toast = useToast()

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

  const loading = {
    severity: 'secondary',
    summary: l10n.value.editor.toast.loading.summary,
    detail: l10n.value.editor.toast.loading.details,
    sticky: true,
  }

  toast.add(loading)

  const reader = new FileReader()
  reader.onload = (e) => {
    let tst = {}
    try {
      const json = JSON.parse(e.target?.result as string)

      const isValid = configValidator(json)

      if (isValid) {
        panelConfig.value = json as PanelConfig
        console.log('Schema loaded:', json)
        tst = {
          severity: 'success',
          summary: l10n.value.editor.toast.success.summary,
          detail: l10n.value.editor.toast.success.details,
          life: 3000,
        }
      } else {
        console.error('Invalid JSON file types:', configValidator.errors)
        const error = configValidator.errors?.[0]
        tst = {
          severity: 'error',
          summary: l10n.value.editor.toast.error.summary,
          detail: `${l10n.value.editor.toast.error.details_ajv} ${error?.instancePath} ${error?.message}`,
          life: 5000,
        }
      }
    } catch (err) {
      console.error('Invalid JSON file', err)
      toast.remove(loading)
      tst = {
        severity: 'error',
        summary: l10n.value.editor.toast.error.summary,
        detail: l10n.value.editor.toast.error.details_schema,
        life: 5000,
      }
    }
    toast.remove(loading)
    toast.add(tst)
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
  <Toolbar v-if="isEditorMode">
    <template #start>
      <div>{{ l10n.editor.toolbar.add_widget }}*</div>
      <div>{{ l10n.editor.toolbar.edit_panel_style }}*</div>
    </template>

    <template #center>
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

        <Button icon="pi pi-save" @click="saveSchema" :label="l10n.editor.toolbar.save_schema" />
      </section>
    </template>

    <template #end>
      <Button @click="setPanelMode(true)" severity="danger" rounded>
        <i class="pi pi-caret-right" />
        {{ l10n.editor.toolbar.start_panel }}
      </Button>
    </template>
  </Toolbar>
  <div class="absolute right-2 top-2" :style="{ zIndex: 1000 }" v-if="!isPanelMode">
    <Checkbox v-model="editorMode" binary />
  </div>
</template>

<style scoped></style>
