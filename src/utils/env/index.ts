export const isProduction = process.env.NODE_ENV === 'production'
export const isPrBuild = process.env.IS_PULL_REQUEST === 'true'

export const features_darkTheme = process.env.NEXT_PUBLIC_ENABLE_DARK_THEME === 'true'

export const backend_uri = process.env.NEXT_PUBLIC_BACKEND_URL

export const googleauth_clientid = process.env.NEXT_PUBLIC_GOOGLEAUTH_CLIENTID
export const googleauth_coderedirector = process.env.NEXT_PUBLIC_GOOGLEAUTH_CODEREDIRECTOR

export const google_tag_manager_container_id = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID || ''
export const google_optimize_filter_order = process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_FILTER_ORDER || ''
export const google_analytic_property = process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_PROPERTY || ''

export const site_url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
export const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'dev'
