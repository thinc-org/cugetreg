import axios from 'axios'

import { BACKEND_URI, ENVIRONMENT, SITE_URL } from '@admin-web/env'

const isClient = typeof window !== 'undefined'

// export const apiUrl = ENVIRONMENT === 'local' && isClient ? `${SITE_URL}/apiProxy` : BACKEND_URI
export const apiUrl = BACKEND_URI

export const httpClient = axios.create({
  baseURL: apiUrl,
})
