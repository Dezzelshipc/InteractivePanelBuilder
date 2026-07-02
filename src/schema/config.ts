export interface PanelConfig {
  version: string
  layout: LayoutConfig
  widgets: Record<string, WidgetConfig>
}

export interface LayoutConfig {
  columns: number
  rows: number
  gap?: string
  class?: string[]
  style?: { [index: string]: string }
}

export interface WidgetPosition {
  x: number
  y: number
  w: number
  h: number
}

export interface WidgetStyle {
  [index: string]: string
}

export interface WidgetConfig<TProps = Record<string, any>> {
  type: string
  position: WidgetPosition
  props?: TProps
  class?: string[]
  style?: WidgetStyle
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
