import { BACKEND_URI, ENVIRONMENT, SITE_URL } from '@web/env'
import axios from 'axios'

const isClient = typeof window !== 'undefined'

export const apiUrl = ENVIRONMENT === 'local' && isClient ? `${SITE_URL}/apiProxy` : BACKEND_URI

export const httpClient = axios.create({
  baseURL: apiUrl,
})
