import type { Component } from 'vue'
import type { WidgetStyle } from './config'

export interface PropSchema {
  name: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'dataSource' | 'color'
  options?: Array<{ value: any; label: string }>
  default?: any
  required?: boolean
}

export interface WidgetDefinition<TClass = string[], TStyle = WidgetStyle> {
  component: Component
  editor?: Component

  propsSchema: PropSchema[]

  label: string
  icon?: string

  defaultClass?: Partial<TClass>
  defaultStyle?: Partial<TStyle>

  // Ограничения по размерам для редактора
  meta?: {
    minWidth?: number
    minHeight?: number
    resizable?: boolean
  }
}

export interface RegisteredWidget extends WidgetDefinition {
  type: string
}
