import axios from 'axios'

import env from '@/utils/env/macro'

const isLocal = env.environment === 'local'
const isClient = typeof window !== 'undefined'

export const apiUrl = isLocal && isClient ? `${env.site.url}/apiProxy` : env.backend.uri

export const httpClient = axios.create({
  baseURL: apiUrl,
})
