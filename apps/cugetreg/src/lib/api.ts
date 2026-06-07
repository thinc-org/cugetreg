import { PUBLIC_API_URL } from '$env/static/public';

import axios from 'axios';

export const api = axios.create({
  baseURL: PUBLIC_API_URL,
  withCredentials: true,
});
