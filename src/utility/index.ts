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
