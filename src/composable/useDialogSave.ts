import { ref, type ModelRef, type Ref } from 'vue'

export function useDialogSave(options: {
  isVisible: Ref<boolean>
  modelProps: ModelRef<any>[] | Ref<any>[]
  onSave: () => void
  onShow?: () => void
  onHide?: () => void
}) {
  let savedStates: any[] = Array(options.modelProps.length)

  const isApply = ref(false)

  function onShowDialog() {
    for (const [i, model] of options.modelProps.entries())
      savedStates[i] = JSON.parse(JSON.stringify(model.value))
    options.onShow?.()
  }

  function onHideDialog() {
    if (!isApply.value) {
      for (const [i, model] of options.modelProps.entries()) model.value = savedStates[i]
    }
    options.onHide?.()
    isApply.value = false
  }

  function onSaveButton() {
    options.onSave()
    isApply.value = true
    options.isVisible.value = false
  }

  return {
    isApply,
    onShowDialog,
    onHideDialog,
    onSaveButton,
  }
}
