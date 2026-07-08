import type { DataSource, PropSchema, WidgetSource } from './widget'

export interface PanelConfig {
  version: string
  layout: LayoutConfig
  widgets: Record<string, WidgetConfig>
  webSocketServer?: string
}

export interface Style {
  [index: string]: string | number | boolean
}

export interface LayoutConfig {
  columns: number
  rows: number
  gap?: number
  class?: string
  style?: Style
}

export interface WidgetPosition {
  x: number
  y: number
  w: number
  h: number
}

export interface WidgetConfig {
  type: string
  position: WidgetPosition
  props?: Record<string, any> & DataSource & WidgetSource
  class?: string
  style?: Style
}

export function get_default_panel_config(): PanelConfig {
  return {
    version: '1.0',
    layout: {
      columns: 4,
      rows: 4,
      style: {
        padding: '1em',
      },
    },
    widgets: {},
  }
}

export const propSchemaLayout: { [k in keyof Required<LayoutConfig>]: PropSchema } = {
  columns: {
    name: 'columns',
    label: 'editor.layout.columns',
    type: 'number',
    default: 4,
    required: true,
  },
  rows: {
    name: 'rows',
    label: 'editor.layout.rows',
    type: 'number',
    default: 4,
    required: true,
  },
  gap: {
    name: 'gap',
    label: 'editor.layout.gap',
    type: 'number',
    default: 0,
    required: false,
  },
  class: {
    name: 'class',
    label: 'editor.styles.class',
    type: 'string',
    default: '',
  },
  style: {
    name: 'style',
    label: 'editor.styles.style',
    type: 'object',
    default: '',
  },
}

export const propWidgetPosition: { [k in keyof Required<WidgetPosition>]: PropSchema } = {
  x: {
    name: 'x',
    label: 'editor.position.x',
    type: 'number',
    default: 0,
    required: true,
  },
  y: {
    name: 'y',
    label: 'editor.position.y',
    type: 'number',
    default: 0,
    required: true,
  },
  w: {
    name: 'w',
    label: 'editor.position.w',
    type: 'number',
    default: 1,
    required: true,
  },
  h: {
    name: 'h',
    label: 'editor.position.h',
    type: 'number',
    default: 1,
    required: true,
  },
}

export const propWebSocketServer: PropSchema = {
  name: 'dataSource',
  label: 'editor.props.webSocketServer',
  type: 'dataSource',
}
