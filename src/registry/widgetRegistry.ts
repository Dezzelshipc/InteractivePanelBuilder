import fullTextWidget from '@/components/widgets/fullText'
import type { WidgetDefinition, RegisteredWidget } from '@/schema/widget'

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

widgetRegistry.register('full_text', fullTextWidget)
