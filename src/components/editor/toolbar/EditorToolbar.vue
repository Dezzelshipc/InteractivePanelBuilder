<script lang="ts" setup>
import { isEditorMode, isPanelMode, setEditorMode, setPanelMode } from '../editorController.ts'
import { l10n } from '@/localization'
import { Button, Checkbox, Toolbar } from 'primevue'
import SchemaUploader from './SchemaUploader.vue'
import LayoutEditor from './LayoutEditor.vue'
import WidgetSelect from './WidgetSelect.vue'
import ExamplesSelect from './ExamplesSelect.vue'
import { panelConfig } from '@/schema/index.ts'
</script>

<template>
  <Toolbar v-if="isEditorMode">
    <template #start>
      <section class="flex flex-row gap-2 items-center">
        <section class="flex flex-col gap-2 items-center">
          <LayoutEditor />
          <WidgetSelect />
        </section>
        <span v-tooltip="l10n.editor.toolbar.widgets_amount">
          {{ Object.keys(panelConfig.widgets).length }}
        </span>
      </section>
    </template>

    <template #center>
      <section class="flex flex-row gap-2 items-center">
        <ExamplesSelect />
        <SchemaUploader />
      </section>
    </template>

    <template #end>
      <section class="flex flex-col items-center gap-2">
        <Button @click="setEditorMode(false)" severity="warn" rounded>
          <i class="pi pi-eye" />
          {{ l10n.editor.toolbar.preview_panel }}
        </Button>

        <Button @click="setPanelMode(true)" severity="danger" rounded>
          <i class="pi pi-caret-right" />
          {{ l10n.editor.toolbar.start_panel }}
        </Button>
      </section>
    </template>
  </Toolbar>
  <div
    class="absolute right-2 top-2 opacity-50"
    :style="{ zIndex: 1000 }"
    v-if="!isPanelMode && !isEditorMode"
  >
    <Button @click="setEditorMode(true)" severity="warn" rounded>
      <i class="pi pi-eye-slash" />
      {{ l10n.editor.toolbar.preview_panel }}
    </Button>
  </div>
</template>
