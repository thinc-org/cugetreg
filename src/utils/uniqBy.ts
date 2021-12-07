export function uniqBy<T>(values: T[], classifier: (value: T) => string): T[] {
  const map = new Map<string, T>()
  for (const value of values) {
    const key = classifier(value)
    if (!map.has(key)) {
      map.set(key, value)
    }
  }
  return Array.from(map.values())
}
