import { selectAlignX, selectAlignY, type WidgetDefinition } from '@/schema/widget'

import FullTextWidget from './FullTextWidget.vue'
import GenericWidgetEditor from '@/components/editor/GenericWidgetEditor.vue'
import { propDataSource } from '@/schema/widget'

export interface FullTextWidgetProps {
  title: string
  title_align: 0 | 1 | 2
  text: string
  text_align: 0 | 1 | 2
  self_align: 0 | 1 | 2
}

export const fullTextWidget: WidgetDefinition = {
  component: FullTextWidget,
  editor: GenericWidgetEditor,
  label: 'widgets.full_text.label',
  icon: '📃',
  propsSchema: [
    {
      name: 'title',
      label: 'widgets.full_text.title',
      type: 'text',
      default: 'widgets.full_text.title',
    },
    {
      name: 'title_align',
      label: 'widgets.full_text.title_align',
      ...selectAlignX,
    },
    {
      name: 'text',
      label: 'widgets.full_text.text',
      type: 'text',
      default: 'widgets.full_text.text',
    },
    {
      name: 'text_align',
      label: 'widgets.full_text.text_align',
      ...selectAlignX,
    },
    {
      name: 'self_align',
      label: 'widgets.full_text.self_align',
      ...selectAlignY,
    },
    propDataSource,
  ],
  defaultStyle: {
    border: '2px solid black',
    borderRadius: '8px',
    padding: '10px',
  },
}

export default fullTextWidget
