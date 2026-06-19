import { env } from '$env/dynamic/public';

const PUBLIC_API_URL = env.PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

import axios from 'axios';

export const api = axios.create({
  baseURL: PUBLIC_API_URL,
  withCredentials: true,
});
