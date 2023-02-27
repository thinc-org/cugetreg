import axios from 'axios'

import { BACKEND_URI } from '@admin-web/env'

export const apiUrl = BACKEND_URI

export const httpClient = axios.create({
  baseURL: apiUrl,
})
