import { PgInsertValue } from 'drizzle-orm/pg-core'

import { user } from '../../schema/userData.js'
import { db } from '../utils/client.js'
import { withTimeLog } from '../utils/log.js'
import { userData } from './_shared.js'

export const seedUsers = () =>
  withTimeLog('Seed Users: Total', async () => {
    const payload = await withTimeLog('Seed Users: Payload', async () => {
      return userData.map((user) => ({
        email: user.email,
        name: user.name,
        googleId: user.google.googleId,
      })) satisfies PgInsertValue<typeof user>[]
    })

    await withTimeLog('Seed Users: Push', async () => {
      let index = 0
      while (index < payload.length) {
        const next = index + 100
        await db
          .insert(user)
          .values(payload.slice(index, next))
          // HOW WE GOT DUPLICATED USER?
          .onConflictDoNothing()
        index = next
      }
    })
  })
