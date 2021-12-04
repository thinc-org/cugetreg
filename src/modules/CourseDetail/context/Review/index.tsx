import { useMutation, useQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { SnackbarContext } from '@/common/context/Snackbar'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { useLoginGuard } from '@/common/hooks/useLoginGuard'
import { Storage } from '@/common/storage'
import { StorageKey } from '@/common/storage/constants'
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
  const localStorage = new Storage('localStorage')
  const methods = useForm<ReviewState>()
  const { studyProgram } = useCourseGroup()
  const { loginGuard } = useLoginGuard()
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
  const [reviewsCache, setReviewsCache] = React.useState<Review[]>([])
  const [myPendingReviewsCache, setMyPendingReviewsCache] = React.useState<Review[]>([])
  /**
   * Initialize context values and form state
   */
  useEffect(() => {
    if (reviewQuery.data) setReviewsCache(reviewQuery.data.reviews)
  }, [reviewQuery.data])
  useEffect(() => {
    if (myPendingReviewQuery.data) setMyPendingReviewsCache(myPendingReviewQuery.data.myPendingReviews)
  }, [myPendingReviewQuery.data])
  useEffect(() => {
    restoreLocalReviewForm()
  }, [])

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
      if (!loginGuard()) return
      const response = await setInteractionMutaion({
        variables: {
          reviewId,
          interaction,
        },
      })
      if (!response.errors && response.data) {
        const newReview = response.data.setInteraction
        setReviewsCache((reviews) => reviews.map((data) => (data._id === newReview._id ? newReview : data)))
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
    alert('coming soon')
  }

  /**
   * User can delete their own pending review
   * @param reviewId - id of the review to be deleted
   */
  const deleteMyPendingReview = async (reviewId: string) => {
    try {
      if (!loginGuard()) return
      const confirm = window.confirm('คุณต้องการลบรีวิวนี้หรือไม่?')
      if (!confirm) return
      const response = await removeReivewMutation({
        variables: {
          reviewId,
        },
      })
      if (!response.errors && response.data) {
        const reviewId = response.data.removeReview._id
        setReviewsCache((reviews) => reviews.filter((data) => data._id !== reviewId))
        setMyPendingReviewsCache((reviews) => reviews.filter((data) => data._id !== reviewId))
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
    setMyPendingReviewsCache((reviews) => {
      const review = reviews.find((data) => data._id === reviewId)
      if (review) setReviewForm(review)
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
      if (!loginGuard(storeLocalReviewForm)) return
      const review = methods.getValues()
      const ratingNumber = review.rating * 2 // 1 - 10, 0 isn't accepted
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
      if (!response.errors && response.data) {
        setMyPendingReviewsCache([response.data.createReview])
        clearReviewForm()
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
      const ratingNumber = review.rating * 2 // 1 - 10, 0 isn't accepted
      const response = await editMyPendingReviewMutation({
        variables: {
          reviewId,
          review: {
            ...review,
            rating: ratingNumber,
          },
        },
      })
      if (!response.errors && response.data) {
        setMyPendingReviewsCache([response.data.editMyPendingReview])
        clearReviewForm()
        emitMessage(`ความคิดเห็นของคุณถูกแก้ไขแล้ว`, 'success')
        setEditingReviewId(undefined)
      }
    } catch (err) {
      emitMessage((err as Error).message, 'error')
    }
  }

  const storeLocalReviewForm = () => {
    localStorage.set<ReviewState>(StorageKey.ReviewForm, methods.getValues())
  }

  const restoreLocalReviewForm = () => {
    const reviewForm = localStorage.get<ReviewState>(StorageKey.ReviewForm)
    if (reviewForm) {
      setReviewForm(reviewForm)
      localStorage.remove(StorageKey.ReviewForm)
    }
  }

  const setReviewForm = (form: Partial<ReviewState>) => {
    if (form.academicYear) methods.setValue('academicYear', form.academicYear)
    if (form.content) methods.setValue('content', form.content)
    if (form.rating) methods.setValue('rating', form.rating / 2)
    if (form.semester) methods.setValue('semester', form.semester)
  }

  const clearReviewForm = () => {
    methods.setValue('content', '')
    methods.setValue('rating', 0)
  }

  const value: ReviewContextValues = {
    reviews: reviewsCache,
    myPendingReviews: myPendingReviewsCache,
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
      <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
    </FormProvider>
  )
}
