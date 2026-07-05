import { defineAsyncComponent } from 'vue'
import { selectAlignX, selectAlignY, type WidgetDefinition } from '@/schema/widget'

const TextWidget = defineAsyncComponent(() => import('./TextWidget.vue'))
const GenericWidgetEditor = defineAsyncComponent(
  () => import('@/components/editor/GenericWidgetEditor.vue'),
)

export interface TextWidgetProps {
  title: string
  title_align: 0 | 1 | 2
  text: string
  text_align: 0 | 1 | 2
  self_align: 0 | 1 | 2
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
      name: 'title_align',
      label: 'widgets.text.title_align',
      ...selectAlignX,
    },
    {
      name: 'text',
      label: 'widgets.text.text',
      type: 'string',
      default: 'widgets.text.text',
    },
    {
      name: 'text_align',
      label: 'widgets.text.text_align',
      ...selectAlignX,
    },
    {
      name: 'self_align',
      label: 'widgets.text.self_align',
      ...selectAlignY,
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
