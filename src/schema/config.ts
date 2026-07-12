import type { DataSource, PropSchema, WidgetSource } from './widget'

export interface PanelConfig {
  version: string
  layout: LayoutConfig
  widgets: Record<string, WidgetConfig>
}

export type Style = {
  [index: string]: string | number | boolean
} & Record<string, any>

export interface LayoutConfig {
  columns: number
  rows: number
  gap?: number
  classGrid?: string
  styleGrid?: Style

  classBackground?: string
  styleBackground?: Style
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
  props: Record<string, any> & DataSource & WidgetSource
  class?: string
  style?: Style
}

export function get_default_panel_config(): PanelConfig {
  return {
    version: '1.0',
    layout: {
      columns: 4,
      rows: 4,
      styleGrid: {
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
  classGrid: {
    name: 'classGrid',
    label: 'editor.styles.class_grid',
    type: 'string',
    default: '',
  },
  styleGrid: {
    name: 'styleGrid',
    label: 'editor.styles.style_grid',
    type: 'object',
    default: '',
  },
  classBackground: {
    name: 'classBackground',
    label: 'editor.styles.class_background',
    type: 'string',
    default: '',
  },
  styleBackground: {
    name: 'styleBackground',
    label: 'editor.styles.style_background',
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

export const defaultStyle = {
  'z-index': 100,
}
