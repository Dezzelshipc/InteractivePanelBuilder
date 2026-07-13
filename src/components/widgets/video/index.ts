import {
  propDataSource,
  selectAlignX,
  selectAlignY,
  type DataSource,
  type WidgetDefinition,
} from '@/schema/widget'

import GenericWidgetEditor from '@/components/editor/GenericWidgetEditor.vue'
import { propWidgetSource, type WidgetSource } from '@/schema/widget'
import VideoWidget from './VideoWidget.vue'

export type VideoWidgetProps = {
  url: string
  autoplay: boolean
  loop: boolean
  muted: boolean
  controls: boolean
  objectFit: 'cover' | 'contain' | 'fill'
} & WidgetSource

export const videoWidget: WidgetDefinition = {
  component: VideoWidget,
  editor: GenericWidgetEditor,
  label: 'widgets.video.label',
  icon: '🎥',
  propsSchema: [
    {
      name: 'url',
      label: 'widgets.video.url',
      info: 'widgets.video.url_info',
      type: 'string',
      required: true,
      default: 'https://example.com/video.mp4',
    },
    {
      name: 'autoplay',
      label: 'widgets.video.autoplay',
      type: 'boolean',
      default: true,
    },
    {
      name: 'loop',
      label: 'widgets.video.loop',
      type: 'boolean',
      default: false,
    },
    {
      name: 'muted',
      label: 'widgets.video.muted',
      type: 'boolean',
      default: true,
    },
    {
      name: 'controls',
      label: 'widgets.video.controls',
      type: 'boolean',
      default: false,
    },
    {
      name: 'objectFit',
      label: 'widgets.video.object_fit',
      info: 'widgets.video.object_fit_info',
      type: 'select',
      options: [
        { value: 'cover', label: 'widgets.video.fit_cover' },
        { value: 'contain', label: 'widgets.video.fit_contain' },
        { value: 'fill', label: 'widgets.video.fit_fill' },
      ],
      default: 'cover',
    },
    propWidgetSource,
  ],
}

export default videoWidget
