import cliProgress from 'cli-progress'
import { and, eq } from 'drizzle-orm'

import { cart, cartItem } from '../../schema.js'
import { db } from '../utils/client.js'
import { withTimeLog } from '../utils/log.js'
import { CourseCart } from '../utils/types.js'
import { userData } from './_shared.js'

export const seedCarts = () =>
  withTimeLog('Seed Carts: Total (N + 1 Moment)', async () => {
    const progress = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic,
    )

    progress.start(userData.length, 0)
    let index = 0

    for (const user of userData) {
      const cartContent =
        (JSON.parse(user.courseCart || '{}') as CourseCart).cartContent ?? []

      if (cartContent.length < 1) {
        continue
      }

      for (const content of cartContent) {
        const existingCart = await db
          .select()
          .from(cart)
          .where(
            and(
              eq(cart.userEmail, user.email),
              eq(cart.studyProgram, content.studyProgram),
              eq(cart.academicYear, +content.academicYear),
              eq(cart.semester, content.semester),
            ),
          )

        let existingCartId = existingCart[0]?.id

        if (!existingCartId) {
          const rt = await db
            .insert(cart)
            .values({
              userEmail: user.email,
              studyProgram: content.studyProgram,
              academicYear: +content.academicYear,
              semester: content.semester,
              name: 'Untitled',
            })
            .returning({ cartId: cart.id })

          existingCartId = rt[0].cartId
        }

        await db.insert(cartItem).values({
          cartId: existingCartId,
          courseNo: content.courseNo,
          sectionNo: +content.selectedSectionNo,
          color: content.color,
          hidden: content.isHidden,
        })
      }

      index++
      progress.update(index)
    }

    progress.stop()
  })
