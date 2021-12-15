import { useMutation, useQuery } from '@apollo/client'
import { createPlateEditor, deserializeHtml, serializeHtml, TNode, usePlateActions } from '@udecode/plate-core'
import escapeHTML from 'escape-html'

import React, { createContext, useContext, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { INITIAL_CONTENT } from '@/common/components/RichTextEditor/constants'
import { plugins } from '@/common/components/RichTextEditor/plugins'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { Storage } from '@/common/storage'
import { StorageKey } from '@/common/storage/constants'
import { Review, ReviewInteractionType } from '@/common/types/reviews'
import { loginGuard } from '@/common/utils/loginGuard'
import { dialog, DialogOptions } from '@/lib/dialog'
import { ReviewForm } from '@/modules/CourseDetail/components/ReviewForm'
import { ReviewList } from '@/modules/CourseDetail/components/ReviewList'
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

import { DEFAULT_REVIEW_CONTEXT_VALUE, REVIEW_FORM_ID } from './constants'
import { ReviewContextValues, ReviewState, ReviewProviderProps } from './types'

export const ReviewContext = createContext<ReviewContextValues>(DEFAULT_REVIEW_CONTEXT_VALUE)

export const useReviewContext = () => useContext(ReviewContext)

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ courseNo, initialReviews }) => {
  const localStorage = new Storage('localStorage')
  const methods = useForm<ReviewState>()
  const { studyProgram } = useCourseGroup()

  const deleteConfirmationDialogOptions: DialogOptions = {
    heading: 'คุณต้องการลบรีวิวนี้หรือไม่?',
    content: 'หากลบรีวิวนี้แล้วจะไม่สามารถกู้ข้อมูลกลับคืนมาได้อีก',
    primaryButtonText: 'ยืนยัน',
    secondaryButtonText: 'ยกเลิก',
  }

  /**
   * Rich Text editor hook
   */
  const editor = createPlateEditor({
    plugins: plugins,
  })
  const { resetEditor, setValue } = usePlateActions(REVIEW_FORM_ID)

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
      toast.error((err as Error).message)
    }
  }

  /**
   * User can report others reviews
   * @param reviewId - id of the review to be reported
   */
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
    const findAndSetReviewFormCallback = (reviews: Review[]) => {
      const review = reviews.find((data) => data._id === reviewId)
      if (review) {
        setReviewForm({
          ...review,
          rating: review.rating / 2,
          content: deserializeHtml(editor, { element: review.content }),
        })
      }
    }
    findAndSetReviewFormCallback(reviewQuery.data?.reviews || [])
    findAndSetReviewFormCallback(myPendingReviewQuery.data?.myPendingReviews || [])
    setEditingReviewId(reviewId)
  }

  /**
   * Use this function to cancel editing review
   */
  const cancelEditReview = () => {
    methods.setValue('content', INITIAL_CONTENT as TNode[])
    setValue(INITIAL_CONTENT, REVIEW_FORM_ID)
    resetEditor(REVIEW_FORM_ID)
    methods.setValue('rating', 0)
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
      const modifiedNode = applyEscapedText(review.content as TNode[])
      const html = serializeHtml(editor, { nodes: modifiedNode })
      const response = await createReviewMutation({
        variables: {
          createReviewInput: {
            courseNo: courseNo,
            studyProgram: studyProgram,
            rating: ratingNumber,
            semester: review.semester,
            academicYear: review.academicYear,
            content: html,
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
      if (!loginGuard(storeLocalReviewForm)) return
      const review = methods.getValues()
      const ratingNumber = review.rating * 2 // 1 - 10, 0 isn't accepted
      const modifiedNode = applyEscapedText(review.content as TNode[])
      const html = serializeHtml(editor, { nodes: modifiedNode })
      const response = await editMyReviewMutation({
        variables: {
          reviewId,
          review: {
            ...review,
            rating: ratingNumber,
            content: html,
          },
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

  const storeLocalReviewForm = () => {
    const formValues = methods.getValues()
    const oldFormValuesSet = localStorage.get<Record<string, ReviewState>>(StorageKey.ReviewForm)
    const newFormValuesSet: Record<string, ReviewState> = {
      ...oldFormValuesSet,
      [courseNo]: { ...formValues, content: formValues.content as TNode[] },
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
    if (form.rating) methods.setValue('rating', form.rating)
    if (form.semester) methods.setValue('semester', form.semester)
    if (form.content) {
      methods.setValue('content', form.content)
      setValue(form.content, REVIEW_FORM_ID)
      resetEditor(REVIEW_FORM_ID)
    }
  }

  /**
   * Convert some syntax to escaped html. For example ">" to "&gt". To prevent XSS attack from user's review input
   * @param value - Plate's TNode
   * @returns
   */
  const applyEscapedText = (value: TNode[] | null): TNode[] => {
    if (!value) return []
    const html = value.map((node: TNode) => {
      if (node.type) return { ...node, children: applyEscapedText(node.children) }
      return { ...node, text: escapeHTML(node.text) }
    }, true)
    return html
  }

  const filterDisplayedReviews = (reviews: Review[]): Review[] => {
    return reviews.filter((data) => data._id !== editingReviewId)
  }

  const value: ReviewContextValues = {
    reviews: filterDisplayedReviews(reviewQuery.data?.reviews || initialReviews),
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
        <ReviewForm />
        <ReviewList />
      </ReviewContext.Provider>
    </FormProvider>
  )
}
