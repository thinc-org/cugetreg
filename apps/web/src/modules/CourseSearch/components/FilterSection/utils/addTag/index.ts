export const addTag = (array: string[] | undefined | null, tag: string) => {
  if (array) return [...array, tag]
  return [tag]
}
