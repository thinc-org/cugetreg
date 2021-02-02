export const isProduction = process.env.NODE_ENV === 'production'

export const features_darkTheme = process.env.NEXT_PUBLIC_ENABLE_DARK_THEME === 'true'

export const backend_uri = process.env.NEXT_PUBLIC_BACKEND_URL

export const googleauth_clientid = process.env.NEXT_PUBLIC_GOOGLEAUTH_CLIENTID
export const googleauth_redirecturi = process.env.NEXT_PUBLIC_GOOGLEAUTH_REDIRECTURI
