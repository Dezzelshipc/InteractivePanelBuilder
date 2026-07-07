import { l10n } from '@/localization'
import type { PropSchema } from '@/schema/widget'

export function getVal(obj: Record<string, any>, path: string | undefined, defaultValue: any) {
  if (!path) return defaultValue
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue
    }
    current = current[key]
  }

  return current !== undefined ? current : defaultValue
}

export function extractSchemaDefaults(schemas: PropSchema[] | undefined) {
  if (schemas === undefined) return {}
  const result: Record<string, any> = {}
  for (const schema of schemas) {
    if ('default' in schema) {
      if (typeof schema.default === 'string') {
        result[schema.name] = getVal(l10n.value, schema.default, schema.default)
      } else {
        result[schema.name] = schema.default
      }
    }
  }
  return result
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}
