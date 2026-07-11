import {
  propDataSource,
  selectAlignX,
  selectAlignY,
  type DataSource,
  type WidgetDefinition,
} from '@/schema/widget'

import TextWidget from './TextWidget.vue'
import GenericWidgetEditor from '@/components/editor/GenericWidgetEditor.vue'
import { propWidgetSource, type WidgetSource } from '@/schema/widget'

export type TextWidgetProps = {
  text: string
  prefix?: string
  postfix?: string
  x_align: 0 | 1 | 2
  y_align: 0 | 1 | 2
} & DataSource &
  WidgetSource

export const textWidget: WidgetDefinition = {
  component: TextWidget,
  editor: GenericWidgetEditor,
  label: 'widgets.text.label',
  icon: '📃',
  propsSchema: [
    {
      name: 'text',
      label: 'widgets.text.text',
      type: 'text',
      default: 'widgets.text.text',
    },
    {
      name: 'prefix',
      label: 'widgets.text.prefix',
      type: 'text',
      default: '',
      required: false,
    },
    {
      name: 'postfix',
      label: 'widgets.text.postfix',
      type: 'text',
      default: '',
      required: false,
    },
    {
      name: 'x_align',
      label: 'widgets.generic.x_align',
      ...selectAlignX,
    },
    {
      name: 'y_align',
      label: 'widgets.generic.y_align',
      ...selectAlignY,
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

export default textWidget
