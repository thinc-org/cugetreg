export function getShortenName(fullName: string) {
  const names = fullName.split(' ')
  const firstName = names[0]
  const lastName = names[names.length - 1]
  return `${firstName} ${lastName.charAt(0)}.`
}
