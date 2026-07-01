import { ref } from 'vue'
import { get_default_panel_config } from './config'

export const panelConfig = ref(get_default_panel_config())

declare global {
  interface Window {
    panelConfig: () => typeof panelConfig.value
  }
}

window.panelConfig = () => panelConfig.value
