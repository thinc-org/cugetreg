import { useMutation, useQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { SnackbarContext } from '@/common/context/Snackbar'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { useLoginGuard } from '@/common/hooks/useLoginGuard'
import { Storage } from '@/common/storage'
import { StorageKey } from '@/common/storage/constants'
import { Review, ReviewInteractionType } from '@/common/types/reviews'
import { CreateReviewResponse, CreateReviewVars, CREATE_REVIEW } from '@/services/apollo/query/createReview'
import { EditMyReviewResponse, EditMyReviewVars, EDIT_MY_REVIEW } from '@/services/apollo/query/editMyReview'
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

export const useReviewContext = () => useContext(ReviewContext)

export const ReviewProvider: React.FC<{ courseNo: string }> = ({ courseNo, children }) => {
  const localStorage = new Storage('localStorage')
  const methods = useForm<ReviewState>()
  const { studyProgram } = useCourseGroup()
  const { loginGuard, Dialog } = useLoginGuard()
  const { emitMessage } = useContext(SnackbarContext)

  const queryVariables = {
    courseNo: courseNo,
    studyProgram: studyProgram,
  }

  /**
   * GraphQL queries
   */
  const reviewQuery = useQuery<GetReviewsResponse, GetReviewsVars>(GET_REVIEWS, {
    variables: queryVariables,
  })
  const myPendingReviewQuery = useQuery<GetMyPendingReviewsResponse, GetMyPendingReviewsVars>(GET_MY_PENDING_REVIEWS, {
    variables: queryVariables,
  })
  const [editMyReviewMutation] = useMutation<EditMyReviewResponse, EditMyReviewVars>(EDIT_MY_REVIEW)
  const [setInteractionMutaion] = useMutation<SetReviewInteractionResponse, SetReviewInteractionVars>(
    SET_REVIEW_INTERACTION
  )
  const [removeReivewMutation] = useMutation<RemoveReviewResponse, RemoveReviewVars>(REMOVE_REVIEW, {
    update: (cache, { data, errors }) => {
      if (errors || !data) return
      const mutatedData = data.removeReview
      const existingReviews =
        cache.readQuery<GetReviewsResponse, GetReviewsVars>({
          query: GET_REVIEWS,
          variables: queryVariables,
        })?.reviews ?? []
      const existingMyPendingReviews =
        cache.readQuery<GetMyPendingReviewsResponse, GetMyPendingReviewsVars>({
          query: GET_MY_PENDING_REVIEWS,
          variables: queryVariables,
        })?.myPendingReviews ?? []
      const newReviews = existingReviews.filter((review) => review._id !== mutatedData._id)
      const newMyPendingReviews = existingMyPendingReviews.filter((review) => review._id !== mutatedData._id)
      cache.writeQuery({
        query: GET_REVIEWS,
        variables: queryVariables,
        data: { reviews: newReviews },
      })
      cache.writeQuery({
        query: GET_MY_PENDING_REVIEWS,
        variables: queryVariables,
        data: { myPendingReviews: newMyPendingReviews },
      })
    },
  })
  const [createReviewMutation] = useMutation<CreateReviewResponse, CreateReviewVars>(CREATE_REVIEW, {
    refetchQueries: [
      {
        query: GET_MY_PENDING_REVIEWS,
        variables: queryVariables,
      },
    ],
  })

  /**
   * Initialize context values and form state
   */
  useEffect(() => {
    restoreLocalReviewForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const setInteraction = async (reviewId: string, interactionType: ReviewInteractionType) => {
    try {
      if (!loginGuard()) return
      await setInteractionMutaion({
        variables: {
          reviewId,
          interactionType,
        },
      })
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
   * User can delete their own review
   * @param reviewId - id of the review to be deleted
   */
  const deleteMyReview = async (reviewId: string) => {
    try {
      if (!loginGuard()) return
      const confirm = window.confirm('คุณต้องการลบรีวิวนี้หรือไม่?')
      if (!confirm) return
      await removeReivewMutation({
        variables: {
          reviewId,
        },
      })
    } catch (err) {
      emitMessage((err as Error).message, 'error')
    }
  }

  /**
   * Use this function to edit a pending review
   * @param reviewId
   */
  const editMyReview = async (reviewId: string) => {
    const findAndSetReviewFormCallback = (reviews: Review[]) => {
      const review = reviews.find((data) => data._id === reviewId)
      if (review) setReviewForm(review)
    }
    findAndSetReviewFormCallback(reviewQuery.data?.reviews || [])
    findAndSetReviewFormCallback(myPendingReviewQuery.data?.myPendingReviews || [])
    setEditingReviewId(reviewId)
  }

  const cancelEditReview = () => {
    clearReviewForm()
    setEditingReviewId(undefined)
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
        postSubmitReview()
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
      if (!loginGuard(storeLocalReviewForm)) return
      const review = methods.getValues()
      const ratingNumber = review.rating * 2 // 1 - 10, 0 isn't accepted
      const response = await editMyReviewMutation({
        variables: {
          reviewId,
          review: {
            ...review,
            rating: ratingNumber,
          },
        },
      })
      if (!response.errors && response.data) {
        postSubmitReview()
      }
    } catch (err) {
      emitMessage((err as Error).message, 'error')
    }
  }

  const postSubmitReview = () => {
    cancelEditReview()
    emitMessage(`เพิ่มรีวิวรายวิชานี้ของคุณแล้ว`, 'success')
  }

  const storeLocalReviewForm = () => {
    const formValues = methods.getValues()
    const oldFormValuesSet = localStorage.get<Record<string, ReviewState>>(StorageKey.ReviewForm)
    const newFormValuesSet: Record<string, ReviewState> = {
      ...oldFormValuesSet,
      [courseNo]: formValues,
    }
    localStorage.set<Record<string, ReviewState>>(StorageKey.ReviewForm, newFormValuesSet)
  }

  const restoreLocalReviewForm = () => {
    const formValuesSet = localStorage.get<Record<string, ReviewState>>(StorageKey.ReviewForm)
    if (formValuesSet && formValuesSet[courseNo]) {
      setReviewForm(formValuesSet[courseNo])
      delete formValuesSet[courseNo]
      localStorage.set<Record<string, ReviewState>>(StorageKey.ReviewForm, formValuesSet)
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

  const filterDisplayedReviews = (reviews: Review[]): Review[] => {
    return reviews.filter((data) => data._id !== editingReviewId)
  }

  const value: ReviewContextValues = {
    reviews: filterDisplayedReviews(reviewQuery.data?.reviews || []),
    myPendingReviews: filterDisplayedReviews(myPendingReviewQuery.data?.myPendingReviews || []),
    setInteraction,
    reportReview,
    deleteMyReview,
    editMyReview,
    cancelEditReview,
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
