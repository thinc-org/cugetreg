// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

export function load(data) {
  return {
    darkMode: data.cookies.get('darkMode') === 'true',
  }
}
