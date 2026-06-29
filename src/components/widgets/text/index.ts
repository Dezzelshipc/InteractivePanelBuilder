import { defineAsyncComponent } from 'vue'
import type { WidgetDefinition } from '@/schema/widget'

const TextWidget = defineAsyncComponent(() => import('./TextWidget.vue'))
const GenericWidgetEditor = defineAsyncComponent(
  () => import('@/components/editor/GenericWidgetEditor.vue'),
)

export interface TextWidgetProps {
  title: string
  text: string
}

export const textWidget: WidgetDefinition = {
  component: TextWidget,
  editor: GenericWidgetEditor,
  label: 'Текст',
  icon: '📃',
  propsSchema: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'string',
      default: 'Заголовок',
    },
    {
      name: 'text',
      label: 'Текст',
      type: 'string',
      default: 'Текст',
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
