import type { DataSource, WebSocketConfig, WidgetSource } from '@/schema/widget'
import { getSubscriptionManager, SubscriptionManager } from '@/webSocket/subscriptionManager'
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

export function useWebSocket(getDataSource: () => WebSocketConfig | null, debounceMs = 100) {
  const data = ref<any>(null)
  const error = ref<Error | null>(null)
  const isSubscribed = ref(false)

  let callback: (payload: any) => void = (payload) => {
    data.value = payload
    error.value = null
  }
  let dataSource: WebSocketConfig
  let subscriptionManager: SubscriptionManager

  function checkDS(ds?: WebSocketConfig | null) {
    return ds && ds.url && ds.topic
  }

  function updateData(ds?: WebSocketConfig | null) {
    const newData = ds ?? getDataSource()
    if (newData) {
      dataSource = { ...newData }
      if (checkDS(dataSource)) subscriptionManager = getSubscriptionManager(dataSource.url)
    }
  }

  function subscribe() {
    if (checkDS(dataSource)) {
      try {
        subscriptionManager.subscribe(dataSource.topic, callback, debounceMs)
        isSubscribed.value = true
      } catch (err) {
        error.value = err as Error
      }
    } else {
      error.value = Error('Server url or Topic name is undefined')
    }
  }

  function unsubscribe() {
    if (isSubscribed.value && checkDS(dataSource)) {
      subscriptionManager.unsubscribe(dataSource.topic, callback)
      isSubscribed.value = false
    }
  }

  onMounted(() => {
    updateData()
    subscribe()
  })

  watch(
    getDataSource,
    (newDataSource) => {
      if (newDataSource?.url !== dataSource?.url || newDataSource?.topic !== dataSource?.topic) {
        unsubscribe()
        updateData(newDataSource)
        subscribe()
      }
    },
    { deep: true, immediate: true },
  )

  onBeforeUnmount(unsubscribe)

  return {
    data: computed(() => data.value),
    error: computed(() => error.value),
    isSubscribed,
  }
}
