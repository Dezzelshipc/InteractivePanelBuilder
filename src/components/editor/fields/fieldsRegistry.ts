import type { Component } from 'vue'
import FieldText from './FieldText.vue'
import FieldBoolean from './FieldBoolean.vue'
import FieldSelect from './FieldSelect.vue'
import FieldNumber from './FieldNumber.vue'
import FieldString from './FieldString.vue'
import FieldDataSource from './FieldDataSource.vue'
import type { PropType } from '@/schema/widget.ts'
import FieldArray from './FieldArray.vue'
import FieldObjectText from './FieldObjectText.vue'
import FieldDatasets from './special/FieldDatasets.vue'
import FieldColor from './FieldColor.vue'

class FieldsRegistry {
  private registry = new Map<string, Component>()

  register(type: PropType | string, component: Component): void {
    if (this.registry.has(type)) {
      console.warn(`Поле "${type}" перезаписан.`)
    }
    this.registry.set(type, component)
  }

  get(type: string, name?: string): Component | undefined {
    if (name && type === 'special') type = `special/${name}`
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

fieldsRegistry.register('text', FieldText)
fieldsRegistry.register('string', FieldString)
fieldsRegistry.register('dataSource', FieldDataSource)
fieldsRegistry.register('number', FieldNumber)
fieldsRegistry.register('boolean', FieldBoolean)
fieldsRegistry.register('select', FieldSelect)
fieldsRegistry.register('array', FieldArray)
fieldsRegistry.register('objectText', FieldObjectText)
fieldsRegistry.register('color', FieldColor)

fieldsRegistry.register('special/datasets', FieldDatasets)
