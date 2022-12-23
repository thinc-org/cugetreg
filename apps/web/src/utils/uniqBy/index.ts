export function uniqBy<T, R>(values: T[], classifier: (value: T) => R): T[] {
  const map = new Map<R, T>()
  for (const value of values) {
    const key = classifier(value)
    if (!map.has(key)) {
      map.set(key, value)
    }
  }
  return Array.from(map.values())
}
