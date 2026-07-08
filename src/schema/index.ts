import { ref, toValue, unref, watch } from 'vue'
import { get_default_panel_config, type PanelConfig } from './config'
import { SubscriptionManager, subscriptionManager } from '@/webSocket/subscriptionManager'
import { deleteWebSocketManager, getWebSocketManager } from '@/webSocket/webSocketManager'
import { isEditorMode } from '@/components/editor/editorController'

export const panelConfig = ref(get_default_panel_config())

watch(isEditorMode, (is_editor) => {
  const server = panelConfig.value.webSocketServer

  if (is_editor) {
    subscriptionManager.removeManager()
    deleteWebSocketManager()

    loadLocalSchema()
    console.log('Loaded saved panel state')

    console.log('Disconnected from web socket server')
  } else if (server) {
    subscriptionManager.setManager(getWebSocketManager(server))
    console.log('Connected to web socket server')
  } else {
    console.log('Not connected to any web socket server')
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
    removeLocalSchema: () => void
  }
}

window.panelConfig = () => panelConfig.value
window.saveLocalSchema = saveLocalSchema
window.loadLocalSchema = loadLocalSchema
window.getLocalSchema = () => localStorage.getItem(localSchemaKey) as string
window.removeLocalSchema = () => localStorage.removeItem(localSchemaKey)
