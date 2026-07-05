import { ref } from 'vue'
import { get_default_panel_config, type PanelConfig } from './config'

export const panelConfig = ref(get_default_panel_config())

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
    removeLocalSchema: () => void
  }
}

window.panelConfig = () => panelConfig.value
window.saveLocalSchema = saveLocalSchema
window.loadLocalSchema = loadLocalSchema
window.getLocalSchema = () => localStorage.getItem(localSchemaKey) as string
window.removeLocalSchema = () => localStorage.removeItem(localSchemaKey)
