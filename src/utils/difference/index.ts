export function difference<T>(a: readonly T[], b: readonly T[]): T[] {
  return a.filter((it) => !b.includes(it))
}
