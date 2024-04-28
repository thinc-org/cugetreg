export function load({ cookies }) {
  return {
    darkMode: cookies.get('darkMode') === 'true',
  }
}
