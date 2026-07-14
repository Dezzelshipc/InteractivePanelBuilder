import { widgetRegistry } from './widgetRegistry'

const widgetModules = import.meta.glob('@/components/widgets/*/index.ts')

export async function loadWidget(type: string) {
  if (widgetRegistry.has(type)) return

  const key = `/src/components/widgets/${type}/index.ts`
  const loadModule = widgetModules[key]

  if (!loadModule) {
    throw new Error(`Модуль для виджета "${type}" не найден`)
  }

  try {
    const module = await loadModule()
    const definition = (module as any).default
    widgetRegistry.register(type, definition)
  } catch (error) {
    console.error(`Не удалось загрузить виджет "${type}"`, error)
    throw error
  }
}
