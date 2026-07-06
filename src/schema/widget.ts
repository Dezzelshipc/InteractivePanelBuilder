import type { Component } from 'vue'
import type { Style } from './config'

export interface PropSchema {
  name: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'dataSource' | 'color' | 'object'
  options?: { value: any; label: string; icon?: string }[]
  default?: any
  required?: boolean
}

export interface WidgetDefinition<TClass = string[], TStyle = Style> {
  component: Component
  editor?: Component

  propsSchema: PropSchema[]

  label: string
  icon?: string

  defaultClass?: Partial<TClass>
  defaultStyle?: Partial<TStyle>
}

export interface RegisteredWidget extends WidgetDefinition {
  type: string
}

export interface Align {
  type: 'string' | 'number' | 'boolean' | 'select' | 'dataSource' | 'color'
  options: { value: any; label: string; icon?: string; description?: string }[]
  default: any
  required: boolean
}

export const selectAlignX: Align = {
  type: 'select',
  options: [
    { value: 0, label: 'fields.select.align.left', icon: 'pi pi-align-left' },
    { value: 1, label: 'fields.select.align.center', icon: 'pi pi-align-center' },
    { value: 2, label: 'fields.select.align.right', icon: 'pi pi-align-right' },
  ],
  default: 0,
  required: true,
}

export const selectAlignY: Align = {
  type: 'select',
  options: [
    { value: 0, label: 'fields.select.align.top', icon: 'pi pi-caret-up' },
    { value: 1, label: 'fields.select.align.center', icon: 'pi pi-bars' },
    { value: 2, label: 'fields.select.align.bottom', icon: 'pi pi-caret-down' },
  ],
  default: 0,
  required: true,
}
