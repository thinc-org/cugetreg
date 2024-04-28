export const removeTag = (array: string[] | undefined | null, tag: string) => {
  if (array) return array.filter((value) => value !== tag)
  return []
}
