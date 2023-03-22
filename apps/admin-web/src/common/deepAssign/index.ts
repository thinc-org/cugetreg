const { hasOwnProperty } = Object.prototype

export function deepAssign<T>(to: T, from: T): T {
  const result = { ...to }
  for (const key in from) {
    if (hasOwnProperty.call(from, key)) {
      const toValue = result[key]
      const fromValue = from[key]
      if (typeof toValue === 'object' && typeof fromValue === 'object') {
        result[key] = deepAssign(toValue, fromValue)
      } else if (typeof fromValue !== 'undefined') {
        result[key] = fromValue
      }
    }
  }
  return result
}
