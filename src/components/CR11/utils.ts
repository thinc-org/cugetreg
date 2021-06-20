/**
 *
 * @param num number to be converted to string
 * @returns number parsed into at least one decimal points
 */
export const toNumberString = (num?: number) => {
  if (!num) {
    return null
  } else if (Number.isInteger(num)) {
    return num + '.0'
  } else {
    return num.toString()
  }
}
