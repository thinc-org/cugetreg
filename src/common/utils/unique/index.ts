export function unique<T>(array: Array<T>) {
  return array.filter((value, index, self) => self.indexOf(value) === index)
}
