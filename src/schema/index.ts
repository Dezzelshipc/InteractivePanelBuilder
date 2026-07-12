import { nextTick, ref, watch } from 'vue'
import { get_default_panel_config, type PanelConfig } from './config'
import {
  startSubscriptionManagers,
  stopSubscriptionManagers,
} from '@/webSocket/subscriptionManager'
import { isEditorMode } from '@/components/editor/editorController'
import { type ToastServiceMethods } from 'primevue'
import { l10n } from '@/localization'
import { configValidator } from './configValidator'

export const panelConfig = ref(get_default_panel_config())

watch(isEditorMode, (is_editor) => {
  if (is_editor) {
    stopSubscriptionManagers()

    setTimeout(() => {
      loadLocalSchema()
      console.log('Loaded saved panel state')
    }, 500)
  } else {
    startSubscriptionManagers()
  }
})

export const localSchemaKey = 'InteractiveSchemaPanelConfig'
export function saveLocalSchema() {
  localStorage.setItem(localSchemaKey, JSON.stringify(panelConfig.value))
}

export function loadLocalSchema() {
  const storage = localStorage.getItem(localSchemaKey)

  if (!storage) {
    return
  }

  try {
    const json = JSON.parse(storage)

    panelConfig.value = json as PanelConfig
    console.log('Schema loaded:', json)
  } catch (err) {
    console.error('Invalid JSON file', err)
  }
}

export function saveSchemaToFile() {
  let date = new Date()
  const offset = date.getTimezoneOffset()
  date = new Date(date.getTime() - offset * 60 * 1000)
  const dateStr = date.toISOString().replace('T', ' ').split('.')[0]
  const fileName = `schema-${dateStr}`

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

export function loadSchemaFromJSON(json: any, toast?: ToastServiceMethods) {
  let tst = {}
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
    saveLocalSchema()
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
  toast?.add(tst)
}

export function loadingSchemaToast(toast?: ToastServiceMethods) {
  const loading = {
    severity: 'secondary',
    summary: l10n.value.editor.toast.loading.summary,
    detail: l10n.value.editor.toast.loading.details,
    sticky: true,
  }
  toast?.add(loading)
  return () => toast?.remove(loading)
}

export function loadSchemaFromString(str: string, toast?: ToastServiceMethods) {
  const delLoad = loadingSchemaToast(toast)
  let tst = {}
  try {
    const json = JSON.parse(str)
    delLoad()
    loadSchemaFromJSON(json, toast)
  } catch (err) {
    console.error('Invalid JSON file', err)
    tst = {
      severity: 'error',
      summary: l10n.value.editor.toast.error.summary,
      detail: l10n.value.editor.toast.error.details_schema,
      life: 5000,
    }
    delLoad()
    toast?.add(tst)
  }
}

declare global {
  interface Window {
    panelConfig: () => typeof panelConfig.value
    saveLocalSchema: typeof saveLocalSchema
    loadLocalSchema: typeof loadLocalSchema
    getLocalSchema: () => string
    getLocalSchemaJSON: () => Record<string, any>
    removeLocalSchema: () => void
  }
}

window.panelConfig = () => panelConfig.value
window.saveLocalSchema = saveLocalSchema
window.loadLocalSchema = loadLocalSchema
window.getLocalSchema = () => localStorage.getItem(localSchemaKey) as string
window.getLocalSchemaJSON = () => JSON.parse(window.getLocalSchema())
window.removeLocalSchema = () => localStorage.removeItem(localSchemaKey)
