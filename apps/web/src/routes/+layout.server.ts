// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

export function load(data) {
  console.log('data', data)

  const darkMode = data.cookies.get('darkMode')

  return {
    darkMode: darkMode === 'true',
  }
}
