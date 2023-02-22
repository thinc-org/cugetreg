import { BACKEND_URI } from '@admin-web/env'
import axios from 'axios'

export const apiUrl = BACKEND_URI

export const httpClient = axios.create({
  baseURL: apiUrl,
})
