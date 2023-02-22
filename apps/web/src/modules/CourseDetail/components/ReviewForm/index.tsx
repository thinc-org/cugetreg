import { useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { Box, Button, MenuItem, Rating, Stack, Typography } from '@mui/material'
import { TNode } from '@udecode/plate-core'
import { RichTextEditor } from '@web/common/components/RichTextEditor'
import { INITIAL_CONTENT } from '@web/common/components/RichTextEditor/initialContent'
import { RichTextEditorRef } from '@web/common/components/RichTextEditor/types'
import { Storage } from '@web/common/storage'
import { StorageKey } from '@web/common/storage/constants'
import { getCurrentTerm } from '@web/common/utils/getCurrentTerm'
import { ControlledSelect } from '@web/modules/CourseDetail/components/ControlledSelect'
import { ReviewEditables } from '@web/modules/CourseDetail/components/ReviewForm/types'

import { Review } from '@cgr/codegen'

import { ContributionGuide } from '../../components/ContributionGuide'
import { useReviewContext } from '../../context/Review'
import { REVIEW_FORM_ID } from '../../context/Review/constants'
import { ReviewState } from '../../context/Review/types'
import { YEAR_SIZE } from './constants'
import { applyEscapedText } from './functions'

const localStorage = new Storage('localStorage')

const defaultValues: ReviewState = {
  academicYear: getCurrentTerm().academicYear,
  semester: '1',
  rating: 0,
  content: INITIAL_CONTENT,
}

export function ReviewForm() {
  const { t } = useTranslation('review')
  const {
    courseNo,
    submitReview,
    submitEditedReview,
    editingReviewId,
    cancelEditReview,
    formRef,
    onFormLoad,
  } = useReviewContext()

  useEffect(() => onFormLoad(), [onFormLoad])

  const methods = useForm({ defaultValues })
  const { handleSubmit, control } = methods

  /**
   * Rich Text editor hook
   */
  const editorRef = useRef<RichTextEditorRef>()
  const getEditor = useCallback(() => editorRef.current, [])
  const editorLoaded = typeof getEditor() !== 'undefined'

  const pendingSetValue = useRef<TNode[]>()
  const setEditorValue = useCallback((newValue: TNode[]) => {
    const currentEditor = editorRef.current
    if (typeof currentEditor === 'undefined') {
      pendingSetValue.current = newValue
      return
    }
    currentEditor.setValue(newValue)
  }, [])

  if (editorLoaded && typeof pendingSetValue.current !== 'undefined') {
    setEditorValue(pendingSetValue.current)
    pendingSetValue.current = undefined
  }

  /**
   * Use this function to cancel editing review
   */
  function clearForm() {
    methods.reset()
    setEditorValue(INITIAL_CONTENT)
  }

  /**
   * Initialize context values and form state
   */
  useEffect(() => {
    restoreLocalReviewForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function restoreFormState(form: Partial<ReviewState>) {
    if (form.academicYear) methods.setValue('academicYear', form.academicYear)
    if (form.rating) methods.setValue('rating', form.rating)
    if (form.semester) methods.setValue('semester', form.semester)
    if (form.content) {
      methods.setValue('content', form.content)
      setEditorValue(form.content)
    }
  }

  function applyFromReview(review: Review) {
    restoreFormState({
      ...review,
      rating: review.rating / 2,
      content: getEditor()?.deserializeHtml(review.content ?? ''),
    })
  }

  function storeLocalReviewForm() {
    const formValues = methods.getValues()
    const oldFormValuesSet = localStorage.get<Record<string, ReviewState>>(StorageKey.ReviewForm)
    const newFormValuesSet: Record<string, ReviewState> = {
      ...oldFormValuesSet,
      [courseNo]: { ...formValues, content: formValues.content as TNode[] },
    }
    localStorage.set<Record<string, ReviewState>>(StorageKey.ReviewForm, newFormValuesSet)
  }

  function restoreLocalReviewForm() {
    const formValuesSet = localStorage.get<Record<string, ReviewState>>(StorageKey.ReviewForm)
    if (formValuesSet && formValuesSet[courseNo]) {
      restoreFormState(formValuesSet[courseNo])
      delete formValuesSet[courseNo]
      localStorage.set<Record<string, ReviewState>>(StorageKey.ReviewForm, formValuesSet)
    }
  }

  function toReview(): ReviewEditables {
    const review = methods.getValues()
    const ratingNumber = review.rating * 2 // 1 - 10, 0 isn't accepted
    const modifiedNode = applyEscapedText(review.content as TNode[])
    const html = getEditor()?.serializeHtml(modifiedNode)
    return {
      rating: ratingNumber,
      semester: review.semester,
      academicYear: review.academicYear,
      content: html,
    }
  }

  useImperativeHandle(formRef, () => ({
    clearForm,
    storeLocalReviewForm,
    restoreFormState,
    applyFromReview,
    toReview,
  }))

  const validateContent = (value: TNode[] | TNode | null): boolean => {
    if (!value) return false
    const isEmpty: boolean = value.reduce((prev: boolean, cur: TNode) => {
      if (cur.type) return prev && validateContent(cur.children)
      return prev && !!cur.text
    }, true)
    return !isEmpty
  }

  const getYearList = (size: number): number[] => {
    const currentYear = parseInt(getCurrentTerm().academicYear)
    return Array(size)
      .fill(0)
      .map((_, index) => currentYear - index)
  }

  const onSubmit: SubmitHandler<ReviewState> = () => {
    if (editingReviewId) submitEditedReview(editingReviewId)
    else submitReview()
  }

  const onError: SubmitErrorHandler<ReviewState> = (errors) => {
    const errorMessageMapping: Record<keyof Pick<ReviewState, 'rating' | 'content'>, string> = {
      content: 'รีวิว',
      rating: 'คะแนน',
    }

    const allErrors = Object.keys(errors)
      .map((error) => errorMessageMapping[error as 'rating' | 'content'])
      .join('และ')
    toast.error(`กรุณากรอก${allErrors}`)
  }

  return (
    <>
      <Box mb={0.5}>
        <Typography
          variant="h4"
          component="span"
          id="review-title"
          mr={2}
          sx={{ display: ['block', 'inline'] }}
        >
          {t('title')}
        </Typography>
        <Typography variant="subtitle1" component="span" color="primaryRange.100">
          {t('subtitle')}
        </Typography>
      </Box>
      <ContributionGuide />
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Stack
          direction={{ xs: 'column-reverse', sm: 'row' }}
          alignItems="center"
          justifyContent="flex-start"
          gap={[2, 4]}
          my={2}
        >
          <Stack direction="row" gap={4} sx={{ width: ['100%', 'auto'] }}>
            <ControlledSelect
              name="academicYear"
              control={control}
              rules={{ required: 'academicYear required' }}
              // label="ปีการศึกษา"
              sx={{ minWidth: 120 }}
              fullWidth
            >
              {getYearList(YEAR_SIZE).map((year) => (
                <MenuItem key={year} value={`${year}`}>
                  {year}
                </MenuItem>
              ))}
            </ControlledSelect>
            <ControlledSelect
              name="semester"
              control={control}
              rules={{ required: 'semester required' }}
              // label="ภาคการศึกษา"
              sx={{ minWidth: 120 }}
              fullWidth
            >
              <MenuItem value="1">ภาคต้น</MenuItem>
              <MenuItem value="2">ภาคปลาย</MenuItem>
              <MenuItem value="3">ฤดูร้อน</MenuItem>
            </ControlledSelect>
          </Stack>
          <Controller
            name="rating"
            control={control}
            defaultValue={0}
            rules={{ required: 'rating should more than 0', validate: (value) => value > 0 }}
            render={({ field: { value, onChange } }) => (
              <Rating
                onChange={(_, value) => onChange(value)}
                value={value}
                precision={0.5}
                size="large"
              />
            )}
          />
        </Stack>
        <Controller
          name="content"
          control={control}
          rules={{ required: 'content should not empty', validate: validateContent }}
          render={({ field: { value, onChange } }) => (
            <RichTextEditor
              ref={editorRef}
              id={REVIEW_FORM_ID}
              defaultValue={value as TNode[]}
              onChange={onChange}
            />
          )}
        />
        <Stack mt={2} mb={4} direction="row" spacing={2}>
          {editingReviewId && (
            <Button variant="outlined" fullWidth onClick={cancelEditReview}>
              {t('cancel')}
            </Button>
          )}
          <Button variant="contained" fullWidth type="submit">
            {t('submit')}
          </Button>
        </Stack>
      </form>
    </>
  )
}
