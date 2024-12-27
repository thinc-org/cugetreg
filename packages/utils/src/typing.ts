export function isEnum<T extends readonly string[]>(
  arr: T,
  value: string,
): value is T[number] {
  return arr.includes(value)
}
