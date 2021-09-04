/**
 * @deprecated use loadash instead
 */
export function sum(array: number[]) {
  return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
}
