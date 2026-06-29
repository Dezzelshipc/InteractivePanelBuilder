import { ref } from 'vue'

export const is_editor = ref(false)

export function switchEditorMode() {
  is_editor.value = !is_editor.value
}

export function setEditorMode(value: boolean) {
  is_editor.value = value
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
