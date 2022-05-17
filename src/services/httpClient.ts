import axios from 'axios'

import { BACKEND_URI } from '@/env'

export const httpClient = axios.create({
  baseURL: BACKEND_URI,
})
