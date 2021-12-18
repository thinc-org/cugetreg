import axios from 'axios'

import { env } from '@/env'

const isClient = typeof window !== 'undefined'

export const apiUrl = env.environment === 'local' && isClient ? `${env.siteUrl}/apiProxy` : env.backendUri

export const httpClient = axios.create({
  baseURL: apiUrl,
})
