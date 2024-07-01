import { PgInsertValue } from 'drizzle-orm/pg-core'

import { review, reviewVotes } from '../../schema.js'
import { db } from '../utils/client.js'
import { withTimeLog } from '../utils/log.js'
import { Interaction, ObjectId } from '../utils/types.js'
import { idToEmail, reviewData } from './_shared.js'

export const seedReviews = () =>
  withTimeLog('Seed Reviews & Votes: Total', async () => {
    const payload = await withTimeLog('Seed Reviews: Payload', async () => {
      return reviewData.map((review) => ({
        userEmail: idToEmail.get(
          (JSON.parse(review.ownerId) as ObjectId).$oid,
        )!,
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
        const interactions = JSON.parse(reviewRaw.interactions) as Interaction[]

        const thisReview = interactions.map((i) => ({
          reviewId,
          userEmail: idToEmail.get(i.userId.$oid)!,
          voteType: i.type,
        })) as PgInsertValue<typeof reviewVotes>[]

        if (thisReview.length > 0) {
          await db.insert(reviewVotes).values(thisReview)
        }

        index += 1
      }
    })
  })
