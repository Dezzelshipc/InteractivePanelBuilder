export interface PanelConfig {
  version: string
  layout: LayoutConfig
  widgets: Record<string, WidgetConfig>
}

export type Style = { [index: string]: string | number | boolean }

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

export interface WidgetConfig<TProps = Record<string, any>> {
  type: string
  position: WidgetPosition
  props?: TProps
  class?: string
  style?: Style
}

export function get_default_panel_config(): PanelConfig {
  return {
    version: '-1.0',
    layout: {
      columns: 4,
      rows: 4,
    },
    widgets: {},
  }
}
