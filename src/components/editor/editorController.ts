import { ref } from 'vue'

export const isEditorMode = ref(false)

export function switchEditorMode() {
  isEditorMode.value = !isEditorMode.value
}

export function setEditorMode(value: boolean) {
  isEditorMode.value = value
}

declare global {
  interface Window {
    switchEditorMode: () => void
    editor: () => void
    setEditorMode: (value: boolean) => void
  }
}
window.switchEditorMode = switchEditorMode
window.editor = switchEditorMode
window.setEditorMode = setEditorMode
