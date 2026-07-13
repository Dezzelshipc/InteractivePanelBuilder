import type { WidgetDefinition, RegisteredWidget } from '@/schema/widget'
import { loadWidget } from './loadWidget'

class WidgetRegistry {
  private registry = new Map<string, RegisteredWidget>()

  register(type: string, definition: WidgetDefinition): void {
    if (this.registry.has(type)) {
      console.warn(`Виджет "${type}" перезаписан.`)
    }
    this.registry.set(type, { ...definition, type })
  }

  get(type: string): RegisteredWidget | undefined {
    return this.registry.get(type) as RegisteredWidget | undefined
  }

  getAll(): RegisteredWidget[] {
    return Array.from(this.registry.values())
  }

  has(type: string): boolean {
    return this.registry.has(type)
  }
}

export const widgetRegistry = new WidgetRegistry()

const to_register = ['fullText', 'text', 'video', 'simpleChart', 'jsonChart']

async function register(types: string[]) {
  for (const widget_type of types) {
    await loadWidget(widget_type)
  }
}

register(to_register).then(() => console.log('Registered widgets'))
