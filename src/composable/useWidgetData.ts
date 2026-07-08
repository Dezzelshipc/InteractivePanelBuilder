import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { subscriptionManager } from '@/webSocket/subscriptionManager'

export function useWebData(topic: () => string | undefined, debounceMs = 100) {
  const data = ref<any>(null)
  const error = ref<Error | null>(null)
  const isSubscribed = ref(false)

  let callback: (payload: any) => void
  let topic_ = topic()

  function subscribe() {
    if (topic_) {
      try {
        subscriptionManager.subscribe(topic_, callback, debounceMs)
        isSubscribed.value = true
      } catch (err) {
        error.value = err as Error
      }
    } else {
      error.value = Error('Topic name is undefined')
    }
  }

  function unsubscribe() {
    if (isSubscribed.value && topic_) {
      subscriptionManager.unsubscribe(topic_, callback)
      isSubscribed.value = false
    }
  }

  onMounted(() => {
    callback = (payload) => {
      data.value = payload
      error.value = null
    }
    topic_ = topic()
    subscribe()
  })

  watch(topic, (newTopic) => {
    unsubscribe()
    topic_ = newTopic
    subscribe()
  })

  onBeforeUnmount(unsubscribe)

  return {
    data: computed(() => data.value),
    error: computed(() => error.value),
    isSubscribed,
  }
}
