import { PgInsertValue } from 'drizzle-orm/pg-core'

import { review, reviewVotes } from '../../schema/userData.js'
import { db } from '../utils/client.js'
import { withTimeLog } from '../utils/log.js'
import { getEmailToUserIdMap, idToEmail, reviewData } from './_shared.js'

export const seedReviews = () =>
  withTimeLog('Seed Reviews & Votes: Total', async () => {
    const emailToUId = await getEmailToUserIdMap()

    const payload = await withTimeLog('Seed Reviews: Payload', async () => {
      return reviewData.map((review) => ({
        userId: emailToUId.get(idToEmail.get(review.ownerId.$oid)!)!,
        studyProgram: review.studyProgram,
        academicYear: +review.academicYear,
        semester: review.semester,
        courseNo: review.courseNo,
        content: review.content,
        rating: review.rating,
        status: review.status,
        rejectionReason: review.rejectionReason,
      })) satisfies PgInsertValue<typeof review>[]
    })

    await withTimeLog('Seed Reviews: Push & Votes', async () => {
      let index = 0
      while (index < payload.length) {
        const { reviewId } = (
          await db
            .insert(review)
            .values(payload[index])
            .returning({ reviewId: review.id })
        )[0]

        const reviewRaw = reviewData[index]
        const interactions = reviewRaw.interactions

        const thisReview = interactions.map((i) => ({
          reviewId,
          userId: emailToUId.get(idToEmail.get(i.userId.$oid)!)!,
          voteType: i.type,
        })) as PgInsertValue<typeof reviewVotes>[]

        if (thisReview.length > 0) {
          await db.insert(reviewVotes).values(thisReview)
        }

        index += 1
      }
    })
  })
