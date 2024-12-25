import { count, like } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { user } from '@repo/database'

import { emailYear, faculty } from './constants.js'

export const pgClient = postgres(process.env.DATABASE_URL as string)
export const db = drizzle(pgClient)

type Output = Record<string, Record<string, number>>

const output: Output = {}

for (const f of faculty) {
  output[f] = {}
  let total = 0

  for (const y of emailYear) {
    const result = await db
      .select({ count: count() })
      .from(user)
      .where(like(user.email, `${y}%${f}@student.chula.ac.th`))

    const rc = result[0].count
    output[f][y] = rc
    total += rc
  }

  output[f]['_total'] = total
}

console.log(JSON.stringify(output, null, 2))

await pgClient.end()
