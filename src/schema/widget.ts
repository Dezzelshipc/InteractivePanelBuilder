import type { Component } from 'vue'
import type { Style } from './config'

export type WebSocketConfig = {
  url: string
  topic: string
}

export interface WidgetSource {
  widgetSource: WebSocketConfig | null
}

export interface DataSource {
  dataSource: WebSocketConfig | null
}

export interface PropSchema {
  name: string
  label: string
  info?: string
  type: 'string' | 'text' | 'number' | 'boolean' | 'select' | 'dataSource' | 'object'
  options?: { value: any; label: string; icon?: string }[]
  default?: any
  required?: boolean
  additional?: Record<string, any>
}

export interface WidgetDefinition {
  component: Component
  editor?: Component

  propsSchema: PropSchema[]

  label: string
  icon?: string

  defaultClass?: string
  defaultStyle?: Style
}

export interface RegisteredWidget extends WidgetDefinition {
  type: string
}

export interface Align {
  type: 'select'
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
  default: 1,
  required: true,
}

export const selectAlignY: Align = {
  type: 'select',
  options: [
    { value: 0, label: 'fields.select.align.top', icon: 'pi pi-caret-up' },
    { value: 1, label: 'fields.select.align.center', icon: 'pi pi-bars' },
    { value: 2, label: 'fields.select.align.bottom', icon: 'pi pi-caret-down' },
  ],
  default: 1,
  required: true,
}

export const propDataSource: PropSchema = {
  name: 'dataSource',
  label: 'widgets.generic.dataSource',
  info: 'widgets.generic.dataSource_info',
  type: 'dataSource',
  additional: {
    label2: 'widgets.generic.dataSource_topic',
  },
  default: null,
}

export const propWidgetSource: PropSchema = {
  name: 'widgetSource',
  label: 'widgets.generic.widgetSource',
  info: 'widgets.generic.widgetSource_info',
  type: 'dataSource',
  additional: {
    label2: 'widgets.generic.dataSource_topic',
  },
  default: null,
}
