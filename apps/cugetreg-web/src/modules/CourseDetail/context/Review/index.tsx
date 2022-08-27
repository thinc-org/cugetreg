import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { useMutation, useQuery } from '@apollo/client'

import { useCourseGroup } from '@web/common/hooks/useCourseGroup'
import { Review, ReviewInteractionType } from '@web/common/types/reviews'
import { loginGuard } from '@web/common/utils/loginGuard'
import { DialogOptions, dialog } from '@web/lib/dialog'
import { ReviewFormRef } from '@web/modules/CourseDetail/components/ReviewForm/types'
import {
  CREATE_REVIEW,
  CreateReviewResponse,
  CreateReviewVars,
} from '@web/services/apollo/query/createReview'
import {
  EDIT_MY_REVIEW,
  EditMyReviewResponse,
  EditMyReviewVars,
} from '@web/services/apollo/query/editMyReview'
import {
  GET_MY_PENDING_REVIEWS,
  GetMyPendingReviewsResponse,
  GetMyPendingReviewsVars,
} from '@web/services/apollo/query/getMyPendingReview'
import {
  GET_REVIEWS,
  GetReviewsResponse,
  GetReviewsVars,
} from '@web/services/apollo/query/getReviews'
import {
  REMOVE_REVIEW,
  RemoveReviewResponse,
  RemoveReviewVars,
} from '@web/services/apollo/query/removeReview'
import {
  SET_REVIEW_INTERACTION,
  SetReviewInteractionResponse,
  SetReviewInteractionVars,
} from '@web/services/apollo/query/setReviewInteraction'

import { DEFAULT_REVIEW_CONTEXT_VALUE } from './constants'
import { ReviewContextValues, ReviewProviderProps } from './types'

export const ReviewContext = createContext<ReviewContextValues>(DEFAULT_REVIEW_CONTEXT_VALUE)

export const useReviewContext = () => useContext(ReviewContext)

export const ReviewProvider: React.FC<ReviewProviderProps> = ({
  courseNo,
  initialReviews,
  children,
}) => {
  const { studyProgram } = useCourseGroup()

  const deleteConfirmationDialogOptions: DialogOptions = {
    heading: 'คุณต้องการลบรีวิวนี้หรือไม่?',
    content: 'หากลบรีวิวนี้แล้วจะไม่สามารถกู้ข้อมูลกลับคืนมาได้อีก',
    primaryButtonText: 'ยืนยัน',
    secondaryButtonText: 'ยกเลิก',
  }

  const [formLoaded, setFormLoaded] = useState(false)
  const onFormLoad = useCallback(() => setFormLoaded(true), [])

  const formRef = useRef<ReviewFormRef>()
  const getForm = useCallback(() => formRef.current, [])

  /**
   * GraphQL queries
   */
  const queryVariables = {
    courseNo: courseNo,
    studyProgram: studyProgram,
  }
  const reviewQuery = useQuery<GetReviewsResponse, GetReviewsVars>(GET_REVIEWS, {
    variables: queryVariables,
  })
  const myPendingReviewQuery = useQuery<GetMyPendingReviewsResponse, GetMyPendingReviewsVars>(
    GET_MY_PENDING_REVIEWS,
    {
      variables: queryVariables,
    }
  )
  const [editMyReviewMutation] = useMutation<EditMyReviewResponse, EditMyReviewVars>(EDIT_MY_REVIEW)
  const [setInteractionMutaion] = useMutation<
    SetReviewInteractionResponse,
    SetReviewInteractionVars
  >(SET_REVIEW_INTERACTION)
  const [removeReivewMutation] = useMutation<RemoveReviewResponse, RemoveReviewVars>(
    REMOVE_REVIEW,
    {
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
        const newMyPendingReviews = existingMyPendingReviews.filter(
          (review) => review._id !== mutatedData._id
        )
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
    }
  )
  const [createReviewMutation] = useMutation<CreateReviewResponse, CreateReviewVars>(
    CREATE_REVIEW,
    {
      refetchQueries: [
        {
          query: GET_MY_PENDING_REVIEWS,
          variables: queryVariables,
        },
      ],
    }
  )

  const reviews = reviewQuery.data?.reviews || initialReviews
  const myPendingReviews = myPendingReviewQuery.data?.myPendingReviews || []

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
      toast.error((err as Error).message)
    }
  }

  /**
   * User can report others reviews
   * @param reviewId - id of the review to be reported
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reportReview = async (reviewId: string) => {
    // TODO
  }

  /**
   * User can delete their own review
   * @param reviewId - id of the review to be deleted
   */
  const deleteMyReview = async (reviewId: string) => {
    try {
      if (!loginGuard()) return
      const onConfirm = async () => {
        await removeReivewMutation({
          variables: {
            reviewId,
          },
        })
        toast.success('ลบรีวิวสำเร็จ')
      }
      dialog({
        ...deleteConfirmationDialogOptions,
        onPrimaryButtonClick: onConfirm,
      })
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  /**
   * Use this function to edit a pending review
   * @param reviewId
   */
  const editMyReview = async (reviewId: string) => {
    const allReviews = [...reviews, ...myPendingReviews]
    const review = allReviews.find((data) => data._id === reviewId)
    if (!review) return

    getForm().applyFromReview(review)
    setEditingReviewId(reviewId)
  }

  /**
   * Use this function to cancel editing review
   */
  const cancelEditReview = () => {
    getForm().clearForm()
    setEditingReviewId(undefined)
  }

  /**
   * Use this function to submit a review for each course
   * @param review - a review object with rating, academicYear, semester, content
   */
  const submitReview = async () => {
    try {
      if (!loginGuard(getForm().storeLocalReviewForm)) return
      const review = getForm().toReview()
      const response = await createReviewMutation({
        variables: {
          createReviewInput: {
            courseNo,
            studyProgram,
            ...review,
          },
        },
      })
      if (!response.errors && response.data) {
        cancelEditReview()
        toast.success('เพิ่มรีวิวสำเร็จ')
      }
    } catch (err) {
      toast.error('คุณได้รีวิววิชานี้แล้ว กรุณาแก้ไขรีวิวเดิมหากต้องการเพิ่มเติมเนื้อหา')
    }
  }

  /**
   * Use this function to submit an editted review
   * @param reviewId - id of the review to be edited
   * @param review - a review object with rating, academicYear, semester, content
   */
  const submitEditedReview = async (reviewId: string) => {
    try {
      if (!loginGuard(getForm().storeLocalReviewForm)) return
      const review = getForm().toReview()
      const response = await editMyReviewMutation({
        variables: {
          reviewId,
          review,
        },
      })
      if (!response.errors && response.data) {
        cancelEditReview()
        toast.success('แก้ไขรีวิวสำเร็จ')
      }
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const filterDisplayedReviews = (reviews: Review[]): Review[] => {
    return reviews.filter((data) => data._id !== editingReviewId)
  }

  const value: ReviewContextValues = {
    courseNo,
    reviews: filterDisplayedReviews(reviews),
    myPendingReviews: filterDisplayedReviews(myPendingReviews),
    setInteraction,
    reportReview,
    deleteMyReview,
    editMyReview,
    cancelEditReview,
    submitReview,
    submitEditedReview,
    editingReviewId,
    formRef,
    formLoaded,
    onFormLoad,
  }

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
}
