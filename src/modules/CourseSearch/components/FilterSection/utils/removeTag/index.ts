export const removeTag = (array: string[] | undefined, tag: string) => {
  if (array) return array.filter((value) => value !== tag)
  return []
}
