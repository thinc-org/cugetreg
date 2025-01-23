// TDD By ChatGPT
export function getShortenName(fullName: string): string {
  // Remove text inside square brackets (including brackets themselves)
  const sanitized = fullName.replace(/\[.*?\]/g, '').trim()

  // Split the sanitized name into parts
  const parts = sanitized.split(/\s+/)

  if (parts.length < 2) {
    // If there's only one part, return it as is (optional, depending on requirements)
    return parts[0] || ''
  }

  // Extract first name and last name (or last relevant part)
  const firstName = parts[0]
  const lastName = parts[parts.length - 1]

  if (firstName === lastName) {
    // If first name is the same as last name, return first name only
    return firstName
  }

  // Return first name and abbreviated last name
  return `${firstName} ${lastName.charAt(0)}.`
}
