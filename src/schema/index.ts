import { ref, watch } from 'vue'
import { get_default_panel_config, type PanelConfig } from './config'
import {
  startSubscriptionManagers,
  stopSubscriptionManagers,
} from '@/webSocket/subscriptionManager'
import { isEditorMode } from '@/components/editor/editorController'

export const panelConfig = ref(get_default_panel_config())

watch(isEditorMode, (is_editor) => {
  if (is_editor) {
    stopSubscriptionManagers()

    loadLocalSchema()
    console.log('Loaded saved panel state')
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
