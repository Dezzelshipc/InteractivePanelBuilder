import { defineAsyncComponent } from 'vue'
import type { WidgetDefinition } from '@/schema/widget'

const TextWidget = defineAsyncComponent(() => import('./TextWidget.vue'))
const GenericWidgetEditor = defineAsyncComponent(
  () => import('@/components/editor/GenericWidgetEditor.vue'),
)

export interface TextWidgetProps {
  title: string
  title_center: boolean
  text: string
  text_center: boolean
}

export const textWidget: WidgetDefinition = {
  component: TextWidget,
  editor: GenericWidgetEditor,
  label: 'Текст',
  icon: '📃',
  propsSchema: [
    {
      name: 'title',
      label: 'widgets.text.title',
      type: 'string',
      default: 'widgets.text.title',
    },
    {
      name: 'title_center',
      label: 'widgets.text.title_center',
      type: 'boolean',
      default: false,
    },
    {
      name: 'text',
      label: 'widgets.text.text',
      type: 'string',
      default: 'widgets.text.text',
    },
    {
      name: 'text_center',
      label: 'widgets.text.text_center',
      type: 'boolean',
      default: false,
    },
  ],
  defaultStyle: {
    borderRadius: '8px',
    padding: '12px',
  },
  meta: {
    resizable: true,
  },
}

export default textWidget
