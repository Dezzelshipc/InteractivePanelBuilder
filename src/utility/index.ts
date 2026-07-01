export function getVal(obj: Record<string, any>, path: string, defaultValue: any) {
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
