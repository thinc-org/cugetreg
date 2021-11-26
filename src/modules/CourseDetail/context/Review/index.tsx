import { useMutation, useQuery } from '@apollo/client'
import { remove, unionBy } from 'lodash'
import React, { createContext, useEffect } from 'react'

import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { Review, ReviewInteraction } from '@/common/types/reviews'
import {
  GetMyPendingReviewsResponse,
  GetMyPendingReviewsVars,
  GET_MY_PENDING_REVIEWS,
} from '@/services/apollo/query/getMyPendingReview'
import { GetReviewsResponse, GetReviewsVars, GET_REVIEWS } from '@/services/apollo/query/getReviews'
import { RemoveReviewResponse, RemoveReviewVars, REMOVE_REVIEW } from '@/services/apollo/query/removeReview'
import {
  SetReviewInteractionResponse,
  SetReviewInteractionVars,
  SET_REVIEW_INTERACTION,
} from '@/services/apollo/query/setReviewInteraction'

import { DEFAULT_REVIEW_CONTEXT_VALUE } from './constants'
import { ReviewContextValues } from './types'

export const ReviewContext = createContext<ReviewContextValues>(DEFAULT_REVIEW_CONTEXT_VALUE)

export const ReviewProvider: React.FC<{ courseNo: string }> = ({ courseNo, children }) => {
  const { studyProgram } = useCourseGroup()

  const reviewQuery = useQuery<GetReviewsResponse, GetReviewsVars>(GET_REVIEWS, {
    variables: {
      courseNo: courseNo,
      studyProgram: studyProgram,
    },
  })

  const myPendingReviewQuery = useQuery<GetMyPendingReviewsResponse, GetMyPendingReviewsVars>(GET_MY_PENDING_REVIEWS, {
    variables: {
      courseNo: courseNo,
      studyProgram: studyProgram,
    },
  })

  const [setInteractionMutaion] = useMutation<SetReviewInteractionResponse, SetReviewInteractionVars>(
    SET_REVIEW_INTERACTION
  )

  const [removeReivewMutation] = useMutation<RemoveReviewResponse, RemoveReviewVars>(REMOVE_REVIEW)

  const [reviews, setReviews] = React.useState<Review[]>([])
  const [myPendingReviews, setMyPendingReviews] = React.useState<Review[]>([])

  useEffect(() => {
    if (reviewQuery.data) setReviews(reviewQuery.data.reviews)
  }, [reviewQuery.data])

  useEffect(() => {
    if (myPendingReviewQuery.data) setMyPendingReviews(myPendingReviewQuery.data.myPendingReviews)
  }, [myPendingReviewQuery.data])

  const setInteraction = async (reviewId: string, interaction: ReviewInteraction) => {
    const response = await setInteractionMutaion({
      variables: {
        reviewId,
        interaction,
      },
    })
    if (!response.errors && response.data) {
      const newReview = response.data.setInteraction
      setReviews((reviews) => unionBy(reviews, [newReview], '_id'))
    }
  }

  const reportReview = async (reviewId: string) => {
    alert('comming soon feature')
  }

  const deleteMyPendingReview = async (reviewId: string) => {
    const response = await removeReivewMutation({
      variables: {
        reviewId,
      },
    })
    if (!response.errors && response.data) {
      const reviewId = response.data.removeReview._id
      setReviews((reviews) => remove(reviews, (data) => data._id === reviewId))
    }
  }

  const value: ReviewContextValues = {
    reviews,
    myPendingReviews,
    setInteraction,
    reportReview,
    deleteMyPendingReview,
  }

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
}
