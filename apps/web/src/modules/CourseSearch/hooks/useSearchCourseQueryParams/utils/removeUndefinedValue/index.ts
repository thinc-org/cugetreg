export function removeUndefinedValue<T extends Record<string, any>>(obj: T): Partial<T> {
  Object.keys(obj).forEach((key: keyof T) => {
    obj[key] === undefined && delete obj[key]
  })
  return obj
}
