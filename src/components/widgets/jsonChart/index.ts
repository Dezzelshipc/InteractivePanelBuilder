import { propDataSource, type DataSource, type WidgetDefinition } from '@/schema/widget'

import { propWidgetSource, type WidgetSource } from '@/schema/widget'
import { defineAsyncComponent } from 'vue'

export type JsonChartWidgetProps = {
  data: Record<string, any>
} & DataSource &
  WidgetSource

export const jsonChartWidget: WidgetDefinition = {
  component: defineAsyncComponent(() => import('./JsonChartWidget.vue')),
  editor: defineAsyncComponent(() => import('@/components/editor/GenericWidgetEditor.vue')),
  label: 'widgets.json_chart.label',
  icon: '📈💻',
  propsSchema: [
    {
      name: 'data',
      label: 'widgets.json_chart.data',
      info: 'widgets.json_chart.data_info',
      type: 'objectText',
      default: {},
    },
    propDataSource,
    propWidgetSource,
  ],
  defaultStyle: {
    border: '2px solid black',
    borderRadius: '8px',
    padding: '10px',
  },
}

export default jsonChartWidget
