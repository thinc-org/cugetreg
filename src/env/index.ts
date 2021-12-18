export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  backendUri: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'local',
  googleAuth: {
    clientId: process.env.NEXT_PUBLIC_GOOGLEAUTH_CLIENTID || '',
    coderedirector: process.env.NEXT_PUBLIC_GOOGLEAUTH_CODEREDIRECTOR || '',
  },
  googleTagManager: {
    containerId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID || '',
  },
  googleAnalytic: {
    propertyId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTIC_PROPERTY_ID || '',
  },
  googleOptimize: {
    filterOrder: process.env.NEXT_PUBLIC_GOOGLE_OPTIMIZE_FILTER_ORDER || '',
  },
  enable: {
    darkTheme: process.env.NEXT_PUBLIC_ENABLE_DARK_THEME === 'true',
    courseThumbnail: process.env.NEXT_PUBLIC_ENABLE_COURSE_THUMBNAIL === 'true',
    daysOfWeekInThumbnail: process.env.NEXT_PUBLIC_ENABLE_DAY_OF_WEEK_THUMBNAIL === 'true',
  },
}
