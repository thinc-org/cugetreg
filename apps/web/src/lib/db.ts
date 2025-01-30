import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '$env/dynamic/private'

export const pgClient = postgres(env.DATABASE_URL as string)
export const db = drizzle(pgClient)
