export interface SchemaMain {
  version: string
  layout: Layout
  widgets: Widget[]
}

export interface Layout {
  columns: string
  rows: string
  gap?: string
  class?: string[]
  style?: { [index: string]: string }
}

export interface Position {
  x: number
  y: number
  w: number
  h: number
}

export interface Widget {
  id: string
  type: string
  position: Position
  props?: object
  class?: string[]
  style?: { [index: string]: string }
}

export function get_default_schema(): SchemaMain {
  return {
    version: '1.0',
    layout: {
      columns: '4',
      rows: '4',
    },
    widgets: [],
  }
}
