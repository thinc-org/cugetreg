export const addTag = (array: string[] | undefined, tag: string) => {
  if (array) return [...array, tag]
  return [tag]
}
