import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { subscriptionManager } from '@/webSocket/subscriptionManager'

export function useWidgetData(topic: string, debounceMs = 100) {
  const data = ref<any>(null)
  const error = ref<Error | null>(null)
  const isSubscribed = ref(false)

  let callback: (payload: any) => void

  onMounted(() => {
    callback = (payload) => {
      data.value = payload
      error.value = null
    }
    if (topic) {
      try {
        subscriptionManager.value?.subscribe(topic, callback, debounceMs)
        isSubscribed.value = true
      } catch (err) {
        error.value = err as Error
      }
    } else {
      error.value = Error('Topic name is undefined')
    }
  })

  onBeforeUnmount(() => {
    if (isSubscribed.value) {
      subscriptionManager.value?.unsubscribe(topic, callback)
      isSubscribed.value = false
    }
  })

  return {
    data: computed(() => data.value),
    error: computed(() => error.value),
    isSubscribed,
  }
}
