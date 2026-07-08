import { ref } from 'vue'
import type { MessageHandler, WebSocketManager } from './webSocketManager'

type Callback = (data: any) => void

export class SubscriptionManager {
  private ws: WebSocketManager
  private cache = new Map<string, any>()
  private debounceTimers = new Map<string, number>()
  private pendingCallbacks = new Map<string, Set<Callback>>()
  private messageHandlers = new Map<string, MessageHandler>()

  constructor(ws: WebSocketManager) {
    this.ws = ws
  }

  public subscribe(topic: string, callback: Callback, debounceMs = 0) {
    if (this.cache.has(topic)) {
      callback(this.cache.get(topic))
    }

    if (!this.pendingCallbacks.has(topic)) {
      this.pendingCallbacks.set(topic, new Set())
    }
    this.pendingCallbacks.get(topic)!.add(callback)

    if (this.pendingCallbacks.get(topic)!.size === 1) {
      const messageHandler: MessageHandler = (payload) => {
        this.cache.set(topic, payload)
        if (debounceMs > 0) {
          const timer = this.debounceTimers.get(topic)
          if (timer) clearTimeout(timer)
          const newTimer = window.setTimeout(() => {
            const callbacks = this.pendingCallbacks.get(topic)
            callbacks?.forEach((cb) => cb(payload))
          }, debounceMs)
          this.debounceTimers.set(topic, newTimer)
        } else {
          const callbacks = this.pendingCallbacks.get(topic)
          callbacks?.forEach((cb) => cb(payload))
        }
      }
      this.ws.subscribe(topic, messageHandler)
      this.messageHandlers.set(topic, messageHandler)
    }
  }

  public unsubscribe(topic: string, callback: Callback) {
    const set = this.pendingCallbacks.get(topic)
    if (set) {
      set.delete(callback)
      if (set.size === 0) {
        this.pendingCallbacks.delete(topic)
        const messageHandler = this.messageHandlers.get(topic)
        if (messageHandler) {
          this.ws.unsubscribe(topic, messageHandler)
          this.messageHandlers.delete(topic)
        }
      }
    }
  }
}

export const subscriptionManager = ref<SubscriptionManager>()
