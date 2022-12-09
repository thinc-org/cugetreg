export function removeUndefinedValue<T extends object>(obj: T): Partial<T> {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key])
  return obj
}
