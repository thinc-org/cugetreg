import Cookies from 'browser-cookies'

// Toggle dark mode value in the cookie, and apply the dark mode class to the root element
const DARK_MODE_COOKIE_NAME = 'darkMode'

export function toggleDarkMode() {
  const darkModeRaw = Cookies.get(DARK_MODE_COOKIE_NAME) === 'true'

  Cookies.set(DARK_MODE_COOKIE_NAME, `${!darkModeRaw}`, { samesite: 'Strict', path: '/' })

  const rootElement = document.getElementById('root')
  rootElement?.classList.toggle('dark')
}
