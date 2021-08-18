export function sum(array: number[]) {
  return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
}

export function unique<T>(array: Array<T>) {
  return array.filter((value, index, self) => self.indexOf(value) === index)
}
