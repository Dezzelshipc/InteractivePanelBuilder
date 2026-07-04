import { ref } from 'vue'
import ru from './ru_ru.json'
import en from './en_us.json'
import { l10n } from '.'

export type LocType = typeof ru & Record<string, any>

export const locs: Record<string, any> = {
  ru: ru,
  en: en,
}

function fill_default(obj: Record<string, any>, def: LocType): LocType {
  const out: Record<string, any> = {}
  for (const key in def) {
    if (typeof obj[key] === 'object') {
      out[key] = fill_default(obj[key], def[key])
    } else {
      out[key] = obj[key] ? obj[key] : def[key]
    }
  }
  return out as LocType
}

export function changeLoc(value: string) {
  let lang: LocType
  if (value != 'ru') {
    lang = fill_default(locs[value], ru)
  } else {
    lang = ru
  }
  l10n.value = lang
}

declare global {
  interface Window {
    changeLoc: (value: string) => void
  }
}
window.changeLoc = changeLoc
