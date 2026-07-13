import { ref } from 'vue'
import {
  deleteWebSocketManager,
  getWebSocketManager,
  type MessageHandler,
  type WebSocketManager,
} from './webSocketManager'

type Callback = (data: any) => void

export class SubscriptionManager {
  private ws?: WebSocketManager
  private cache = new Map<string, any>()
  private throttleAvailability = new Map<string, boolean>()
  private pendingCallbacks = new Map<string, Set<Callback>>()
  private messageHandlers = new Map<string, MessageHandler>()

  constructor() {}

  public setManager(ws: WebSocketManager) {
    this.ws = ws
    for (const [topic, handler] of this.messageHandlers.entries()) {
      this.ws.subscribe(topic, handler)
    }
  }

  public removeManager() {
    for (const [topic, handler] of this.messageHandlers.entries()) {
      this.ws?.unsubscribe(topic, handler)
    }
    this.ws = undefined
  }

  public subscribe(topic: string, callback: Callback, throttleMs = 0) {
    if (this.cache.has(topic)) {
      callback(this.cache.get(topic))
    }

    if (!this.pendingCallbacks.has(topic)) {
      this.pendingCallbacks.set(topic, new Set())
    }
    this.pendingCallbacks.get(topic)!.add(callback)

    if (this.pendingCallbacks.get(topic)!.size === 1) {
      this.throttleAvailability.set(topic, true)
      const messageHandler: MessageHandler = (payload) => {
        this.cache.set(topic, payload)
        if (throttleMs > 0) {
          if (!this.throttleAvailability.get(topic)) return
          this.throttleAvailability.set(topic, false)

          window.setTimeout(() => {
            this.throttleAvailability.set(topic, true)
          }, throttleMs)
        }
        const callbacks = this.pendingCallbacks.get(topic)
        callbacks?.forEach((cb) => cb(payload))
      }
      this.ws?.subscribe(topic, messageHandler)
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
          this.ws?.unsubscribe(topic, messageHandler)
          this.messageHandlers.delete(topic)
        }
      }
    }
  }
}

let subscriptionManagers: Map<string, SubscriptionManager> = new Map()

export function getSubscriptionManager(url: string) {
  if (!subscriptionManagers.has(url)) subscriptionManagers.set(url, new SubscriptionManager())
  return subscriptionManagers.get(url)!
}

export function deleteSubscriptionManager(url: string) {
  if (subscriptionManagers.has(url)) subscriptionManagers.delete(url)
}

export function startSubscriptionManagers() {
  for (const [url, manager] of subscriptionManagers.entries()) {
    manager.setManager(getWebSocketManager(url))
  }
}

export function stopSubscriptionManagers() {
  for (const [url, manager] of subscriptionManagers.entries()) {
    manager.removeManager()
    deleteWebSocketManager(url)
  }
}
