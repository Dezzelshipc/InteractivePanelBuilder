import type { Component } from 'vue'
import FieldString from './FieldString.vue'
import FieldBoolean from './FieldBoolean.vue'
import FieldSelect from './FieldSelect.vue'
import FieldNumber from './FieldNumber.vue'

class FieldsRegistry {
  private registry = new Map<string, Component>()

  register(type: string, component: Component): void {
    if (this.registry.has(type)) {
      console.warn(`Поле "${type}" перезаписан.`)
    }
    this.registry.set(type, component)
  }

  get(type: string): Component | undefined {
    return this.registry.get(type) as Component | undefined
  }

  getAll(): Component[] {
    return Array.from(this.registry.values())
  }

  has(type: string): boolean {
    return this.registry.has(type)
  }
}

export const fieldsRegistry = new FieldsRegistry()

fieldsRegistry.register('string', FieldString)
fieldsRegistry.register('number', FieldNumber)
fieldsRegistry.register('boolean', FieldBoolean)
fieldsRegistry.register('select', FieldSelect)
