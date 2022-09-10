import {
  GetMyPendingReviewsDocument,
  GetMyPendingReviewsQuery,
  GetMyPendingReviewsQueryVariables,
  GetReviewsDocument,
  GetReviewsQuery,
  GetReviewsQueryVariables,
  useCreateReviewMutation,
  useEditMyReviewMutation,
  useGetMyPendingReviewsQuery,
  useGetReviewsQuery,
  useRemoveReviewMutation,
  useSetReviewInteractionMutation,
} from '@cugetreg/codegen'

import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { useCourseGroup } from '@web/common/hooks/useCourseGroup'
import { Review, ReviewInteractionType } from '@web/common/types/reviews'
import { loginGuard } from '@web/common/utils/loginGuard'
import { DialogOptions, dialog } from '@web/lib/dialog'
import { ReviewFormRef } from '@web/modules/CourseDetail/components/ReviewForm/types'

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

  const reviewQuery = useGetReviewsQuery({
    variables: queryVariables,
  })
  const myPendingReviewQuery = useGetMyPendingReviewsQuery({
    variables: queryVariables,
  })

  const [editMyReviewMutation] = useEditMyReviewMutation()
  const [setInteractionMutaion] = useSetReviewInteractionMutation()

  const [removeReviewMutation] = useRemoveReviewMutation({
    update: (cache, { data, errors }) => {
      if (errors || !data) return

      const mutatedData = data.removeReview

      const existingReviews =
        cache.readQuery<GetReviewsQuery, GetReviewsQueryVariables>({
          query: GetReviewsDocument,
          variables: queryVariables,
        })?.reviews ?? []

      const existingMyPendingReviews =
        cache.readQuery<GetMyPendingReviewsQuery, GetMyPendingReviewsQueryVariables>({
          query: GetMyPendingReviewsDocument,
          variables: queryVariables,
        })?.myPendingReviews ?? []

      const newReviews = existingReviews.filter((review) => review._id !== mutatedData._id)
      const newMyPendingReviews = existingMyPendingReviews.filter(
        (review) => review._id !== mutatedData._id
      )

      cache.writeQuery({
        query: GetReviewsDocument,
        variables: queryVariables,
        data: { reviews: newReviews },
      })
      cache.writeQuery({
        query: GetMyPendingReviewsDocument,
        variables: queryVariables,
        data: { myPendingReviews: newMyPendingReviews },
      })
    },
  })

  const [createReviewMutation] = useCreateReviewMutation()

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
        await removeReviewMutation({
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
