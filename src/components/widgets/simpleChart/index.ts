import { type PropSchema, type WidgetDefinition } from '@/schema/widget'

import { propWidgetSource, type WidgetSource } from '@/schema/widget'
import { defineAsyncComponent } from 'vue'

export type SimpleChartType = 'line' | 'bar' | 'pie' | 'polarArea' | 'radar'

const typeOptions = [
  { value: 'line', label: 'Line' },
  { value: 'bar', label: 'Bar' },
  { value: 'pie', label: 'Pie' },
  { value: 'polarArea', label: 'Polar' },
  { value: 'radar', label: 'Radar' },
]

export interface SimpleDataset {
  type?: SimpleChartType
  label: string
  data: number[]
  backgroundColor: string
  borderColor: string
}

export const simpleDatasetProps: PropSchema[] = [
  {
    name: 'type',
    label: 'widgets.simple_chart.type',
    type: 'select',
    options: [{ value: undefined, label: 'widgets.simple_chart.type_main' }, ...typeOptions],
    required: false,
  },
  {
    name: 'label',
    label: 'widgets.simple_chart.dataset.label',
    type: 'string',
    required: true,
  },
  {
    name: 'data',
    label: 'widgets.simple_chart.dataset.data',
    type: 'array',
    required: true,
  },
  {
    name: 'backgroundColor',
    label: 'widgets.simple_chart.dataset.background_color',
    type: 'color',
    required: true,
  },
  {
    name: 'borderColor',
    label: 'widgets.simple_chart.dataset.border_color',
    type: 'color',
    required: true,
  },
]

export type SimpleChartWidgetProps = {
  type: SimpleChartType
  labels: string[]
  datasets: SimpleDataset[]
  options: Record<string, any>
} & WidgetSource

export const simpleChartWidget: WidgetDefinition = {
  component: defineAsyncComponent(() => import('./SimpleChartWidget.vue')),
  editor: defineAsyncComponent(() => import('@/components/editor/GenericWidgetEditor.vue')),
  label: 'widgets.simple_chart.label',
  icon: '📈',
  propsSchema: [
    {
      name: 'type',
      label: 'widgets.simple_chart.type',
      type: 'select',
      options: typeOptions,
      default: 'line',
    },
    {
      name: 'labels',
      label: 'widgets.simple_chart.labels',
      type: 'array',
      default: [],
    },
    {
      name: 'datasets',
      label: 'widgets.simple_chart.datasets',
      type: 'special',
      default: [],
    },
    {
      name: 'options',
      label: 'widgets.simple_chart.options',
      info: 'widgets.simple_chart.options_info',
      type: 'objectText',
      default: {},
    },
    propWidgetSource,
  ],
  defaultStyle: {
    border: '2px solid black',
    borderRadius: '8px',
    padding: '10px',
  },
}

export default simpleChartWidget
