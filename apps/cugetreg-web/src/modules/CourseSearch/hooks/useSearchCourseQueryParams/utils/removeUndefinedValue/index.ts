// eslint-disable-next-line
export function removeUndefinedValue<T extends { [key: string]: any }>(
  obj: T
): { [key: string]: any } {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key])
  return obj
}
