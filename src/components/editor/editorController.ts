import { readonly, ref } from 'vue'

export const editorMode = ref(true)
const panelMode = ref(false)

export const isEditorMode = readonly(editorMode)
export const isPanelMode = readonly(panelMode)

export function switchEditorMode() {
  editorMode.value = !editorMode.value
  panelMode.value = false
}

export function setEditorMode(value: boolean) {
  editorMode.value = value
  panelMode.value = false
}

export function switchPanelMode() {
  panelMode.value = !panelMode.value
  editorMode.value = !panelMode.value
}

export function setPanelMode(value: boolean) {
  panelMode.value = value
  editorMode.value = !value
}

declare global {
  interface Window {
    switchEditorMode: () => void
    editor: () => void
    setEditorMode: (value: boolean) => void

    switchPanelMode: () => void
    panel: () => void
    setPanelMode: (value: boolean) => void
  }
}
window.switchEditorMode = switchEditorMode
window.editor = switchEditorMode
window.setEditorMode = setEditorMode

window.switchPanelMode = switchPanelMode
window.panel = switchPanelMode
window.setPanelMode = setPanelMode
