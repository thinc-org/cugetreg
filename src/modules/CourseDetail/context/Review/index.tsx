import { useMutation, useQuery } from '@apollo/client'
import { filter, unionBy } from 'lodash'
import React, { createContext, useContext, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { SnackbarContext } from '@/common/context/Snackbar'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { useLoginGuard } from '@/common/hooks/useLoginGuard'
import { Review, ReviewInteraction } from '@/common/types/reviews'
import { CreateReviewResponse, CreateReviewVars, CREATE_REVIEW } from '@/services/apollo/query/createReview'
import {
  EditMyPendingReviewResponse,
  EditMyPendingReviewVars,
  EDIT_MY_PENDING_REVIEW,
} from '@/services/apollo/query/editMyPendingReview'
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
import { ReviewContextValues, ReviewState } from './types'

export const ReviewContext = createContext<ReviewContextValues>(DEFAULT_REVIEW_CONTEXT_VALUE)

export const ReviewProvider: React.FC<{ courseNo: string }> = ({ courseNo, children }) => {
  const methods = useForm<ReviewState>()
  const { studyProgram } = useCourseGroup()
  const { isLoggedIn, Dialog } = useLoginGuard()
  const { emitMessage } = useContext(SnackbarContext)

  /**
   * GraphQL queries
   */
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
  const [createReviewMutation] = useMutation<CreateReviewResponse, CreateReviewVars>(CREATE_REVIEW)
  const [editMyPendingReviewMutation] = useMutation<EditMyPendingReviewResponse, EditMyPendingReviewVars>(
    EDIT_MY_PENDING_REVIEW
  )

  /**
   * React state for local caching
   */
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [myPendingReviews, setMyPendingReviews] = React.useState<Review[]>([])
  useEffect(() => {
    if (reviewQuery.data) setReviews(reviewQuery.data.reviews)
  }, [reviewQuery.data])
  useEffect(() => {
    if (myPendingReviewQuery.data) setMyPendingReviews(myPendingReviewQuery.data.myPendingReviews)
  }, [myPendingReviewQuery])

  /**
   * Normal React state
   */
  const [editingReviewId, setEditingReviewId] = React.useState<string | undefined>(undefined)

  /**
   * Use this function to set the interaction of a review
   * @param reviewId - id of the review to be changed the user's interaction
   * @param interaction - the new interaction
   */
  const setInteraction = async (reviewId: string, interaction: ReviewInteraction) => {
    try {
      if (!isLoggedIn()) return
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
    } catch (err) {
      emitMessage((err as Error).message, 'error')
    }
  }

  /**
   * User can report others reviews
   * @param reviewId - id of the review to be reported
   */
  const reportReview = async (reviewId: string) => {
    alert('comming soon')
  }

  /**
   * User can delete their own pending review
   * @param reviewId - id of the review to be deleted
   */
  const deleteMyPendingReview = async (reviewId: string) => {
    try {
      if (!isLoggedIn()) return
      const confirm = window.confirm('คุณต้องการลบรีวิวนี้หรือไม่?')
      if (!confirm) return
      const response = await removeReivewMutation({
        variables: {
          reviewId,
        },
      })
      if (!response.errors && response.data) {
        const reviewId = response.data.removeReview._id
        setReviews((reviews) => filter(reviews, (data) => data._id !== reviewId))
        setMyPendingReviews((reviews) => filter(reviews, (data) => data._id !== reviewId))
      }
    } catch (err) {
      emitMessage((err as Error).message, 'error')
    }
  }

  /**
   * Use this function to edit a pending review
   * @param reviewId
   */
  const editMyPendingReview = async (reviewId: string) => {
    setMyPendingReviews((reviews) => {
      const review = reviews.find((data) => data._id === reviewId)
      if (review) {
        methods.setValue('academicYear', review.academicYear)
        methods.setValue('content', review.content)
        methods.setValue('rating', review.rating / 2)
        methods.setValue('semester', review.semester)
      }
      return reviews.filter((data) => data._id !== reviewId)
    })
    setEditingReviewId(reviewId)
  }

  /**
   * Use this function to submit a review for each course
   * @param review - a review object with rating, academicYear, semester, content
   */
  const submitReview = async () => {
    try {
      if (!isLoggedIn()) return
      const review = methods.getValues()
      const ratingNumber = parseRating(review.rating) * 2 // 1 - 10, 0 isn't accepted
      const response = await createReviewMutation({
        variables: {
          createReviewInput: {
            courseNo: courseNo,
            studyProgram: studyProgram,
            rating: ratingNumber,
            semester: review.semester,
            academicYear: review.academicYear,
            content: review.content,
          },
        },
      })
      if (response.data) {
        await myPendingReviewQuery.refetch()
        clearForm()
        emitMessage(`เพิ่มความคิดเห็นของคุณแล้ว`, 'success')
      }
    } catch (err) {
      emitMessage((err as Error).message, 'error')
    }
  }

  /**
   * Use this function to submit an editted review
   * @param reviewId - id of the review to be edited
   * @param review - a review object with rating, academicYear, semester, content
   */
  const submitEditedReview = async (reviewId: string) => {
    try {
      const review = methods.getValues()
      const ratingNumber = parseRating(review.rating) * 2 // 1 - 10, 0 isn't accepted
      const response = await editMyPendingReviewMutation({
        variables: {
          reviewId,
          review: {
            ...review,
            rating: ratingNumber,
          },
        },
      })
      if (response.data) {
        await myPendingReviewQuery.refetch()
        clearForm()
        emitMessage(`ความคิดเห็นของคุณถูกแก้ไขแล้ว`, 'success')
        setEditingReviewId(undefined)
      }
    } catch (err) {
      emitMessage((err as Error).message, 'error')
    }
  }

  const clearForm = () => {
    methods.setValue('content', '')
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/
    /* @ts-ignore */
    methods.setValue('rating', null)
  }

  const parseRating = (rating: string | number) => {
    return typeof rating === 'string' ? parseFloat(rating) : rating
  }

  const value: ReviewContextValues = {
    reviews,
    myPendingReviews,
    setInteraction,
    reportReview,
    deleteMyPendingReview,
    editMyPendingReview,
    submitReview,
    submitEditedReview,
    editingReviewId,
  }

  return (
    <FormProvider {...methods}>
      <ReviewContext.Provider value={value}>
        <Dialog />
        {children}
      </ReviewContext.Provider>
    </FormProvider>
  )
}
