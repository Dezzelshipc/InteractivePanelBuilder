import { widgetRegistry } from './widgetRegistry'

export async function loadWidget(type: string) {
  if (widgetRegistry.has(type)) return

  try {
    const module = await import(`@/components/widgets/${type}/index.ts`)
    const definition = module.default
    widgetRegistry.register(type, definition)
  } catch (error) {
    console.error(`Не удалось загрузить виджет "${type}"`, error)
    throw error
  }
}
