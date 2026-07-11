import { computed, ref, type Ref, type ModelRef, readonly, toValue, useTemplateRef } from 'vue'

export interface Validable {
  isValid?: Ref<boolean>
}

export function checkRequiredArray(amount: number) {
  const arrayRefs = Array.from({ length: amount }, () => ref<Validable | undefined>())
  const isAll = computed(() =>
    arrayRefs.every((x) => {
      const instance = x.value
      if (!instance) return true
      return toValue(instance.isValid) ?? true
    }),
  )
  return {
    arrayRefs,
    isAll,
  }
}

export function checkRequiredTemplate(name: string) {
  const arrayRefs = useTemplateRef<Validable[]>(name)
  const isAll = computed(() =>
    arrayRefs.value?.every((x) => {
      return toValue(x.isValid) ?? true
    }),
  )

  return {
    arrayRefs,
    isAll,
  }
}

interface CheckField {
  model: ModelRef<any> | Ref<any>
  required: boolean | undefined
  validator?: (value: any) => boolean
}

export function checkValid(models: CheckField[]) {
  const isValid = readonly(
    computed(() => {
      let valid = true
      for (const m of models) {
        if (!m.required) continue
        valid &&= m.model.value != null
        valid &&= m.validator?.(m.model.value) ?? true

        if (!valid) break
      }
      return valid
    }),
  )

  return {
    isValid,
  }
}
