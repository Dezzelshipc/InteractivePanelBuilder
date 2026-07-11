import { isEditorMode } from '@/components/editor/editorController'
import { ref } from 'vue'

export type MessageHandler = (payload: any) => void

export class WebSocketManager {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectDelay = 1000
  private heartbeatInterval: number | null = null
  private messageQueue: any[] = []
  private handlers: Map<string, Set<MessageHandler>> = new Map()

  public isConnected = ref(false)

  public getUrl() {
    return this.url
  }

  constructor(url: string) {
    this.url = url
    this.connect()
  }

  private connect() {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = () => {
      this.isConnected.value = true
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.flushQueue()

      if (this.handlers.size > 0) {
        for (const topic of this.handlers.keys()) this.send({ action: 'subscribe', topic })
      }
    }
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      const topic = data.topic || '__global__'
      const handlers = this.handlers.get(topic)
      if (handlers && !isEditorMode.value) {
        handlers.forEach((fn) => fn(data.payload))
      }
    }
    this.ws.onclose = () => {
      this.isConnected.value = false
      this.stopHeartbeat()
      this.reconnect()
    }
    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err)
    }
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.ws) return
    const delay = Math.min(30000, this.reconnectDelay * Math.pow(2, this.reconnectAttempts))
    setTimeout(() => {
      this.reconnectAttempts++
      this.connect()
    }, delay)
  }

  private startHeartbeat() {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000)
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private flushQueue() {
    while (this.messageQueue.length) {
      const msg = this.messageQueue.shift()
      this.send(msg)
    }
  }

  public send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.messageQueue.push(message)
    }
  }

  public subscribe(topic: string, handler: MessageHandler) {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set())
      this.send({ action: 'subscribe', topic })
    }
    this.handlers.get(topic)!.add(handler)
  }

  public unsubscribe(topic: string, handler: MessageHandler) {
    const set = this.handlers.get(topic)
    if (set) {
      set.delete(handler)
      if (set.size === 0) {
        this.handlers.delete(topic)
        this.send({ action: 'unsubscribe', topic })
      }
    }
  }

  public destroy() {
    this.stopHeartbeat()
    this.ws?.close()
    this.ws = null
  }
}

let wsManagers: Map<string, WebSocketManager> = new Map()

export function getWebSocketManager(url: string) {
  if (!wsManagers.has(url)) wsManagers.set(url, new WebSocketManager(url))
  return wsManagers.get(url)!
}

export function deleteWebSocketManager(url: string) {
  if (wsManagers.has(url)) {
    wsManagers.get(url)?.destroy()
    wsManagers.delete(url)
  }
}
