import { computed, ref, type Ref } from 'vue'

export interface Validable {
  validate?: () => boolean
}

export function checkRequired(options: { amount: number }) {
  let arrayRefs: Ref<Validable | undefined>[] = Array(options.amount)
  for (let i = 0; i < arrayRefs.length; i += 1) {
    arrayRefs[i] = ref<Validable>()
  }

  const isAll = computed(() => arrayRefs.every((x) => x?.value?.validate?.()))
  return {
    arrayRefs,
    isAll,
  }
}
