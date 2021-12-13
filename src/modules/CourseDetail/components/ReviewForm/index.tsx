import { Rating, Select, Stack, MenuItem, Typography, Button } from '@mui/material'
import { TNode } from '@udecode/plate-core'

import { Controller, SubmitHandler, SubmitErrorHandler, useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { RichTextEditor } from '@/common/components/RichTextEditor'
import { getCurrentTerm } from '@/common/utils/getCurrentTerm'

import { ContributionGuide } from '../../components/ContributionGuide'
import { useReviewContext } from '../../context/Review'
import { REVIEW_FORM_ID } from '../../context/Review/constants'
import { ReviewState } from '../../context/Review/types'
import { YEAR_SIZE } from './constants'

export const ReviewForm = () => {
  const { register, handleSubmit, control } = useFormContext<ReviewState>()
  const { academicYear, semester } = getCurrentTerm()
  const { t } = useTranslation('review')
  const { submitReview, submitEditedReview, editingReviewId, cancelEditReview } = useReviewContext()

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

  const onSubmit: SubmitHandler<ReviewState> = async (data) => {
    if (editingReviewId) await submitEditedReview(editingReviewId)
    else await submitReview()
    console.log(data)
  }

  const onError: SubmitErrorHandler<ReviewState> = (errors) => {
    const errorMessageMapping: Record<keyof Pick<ReviewState, 'rating' | 'content'>, string> = {
      content: 'รีวิว',
      rating: 'คะแนน',
    }

    const allErros = Object.keys(errors)
      .map((error) => errorMessageMapping[error as 'rating' | 'content'])
      .join('และ')
    toast.error(`กรุณากรอก${allErros}`)
  }

  return (
    <>
      <ContributionGuide />
      <Typography variant="h4" component="span" id="review-title" mr={2} sx={{ display: ['block', 'inline'] }}>
        {t('title')}
      </Typography>
      <Typography variant="subtitle1" component="span" color="primaryRange.100">
        {t('subtitle')}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Stack
          direction={{ xs: 'column-reverse', sm: 'row' }}
          alignItems="center"
          justifyContent="flex-start"
          gap={[2, 4]}
          mt={1}
          mb={2}
        >
          <Stack direction="row" gap={4} sx={{ width: ['100%', 'auto'] }}>
            <Select
              {...register('academicYear', { required: 'academicYear required' })}
              // label="ปีการศึกษา"
              defaultValue={academicYear}
              sx={{ minWidth: 120 }}
              fullWidth
            >
              {getYearList(YEAR_SIZE).map((year) => (
                <MenuItem key={year} value={`${year}`}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            <Select
              {...register('semester', { required: 'semester required' })}
              // label="ภาคการศึกษา"
              defaultValue={semester}
              sx={{ minWidth: 120 }}
              fullWidth
            >
              <MenuItem value="1">ภาคต้น</MenuItem>
              <MenuItem value="2">ภาคปลาย</MenuItem>
              <MenuItem value="3">ฤดูร้อน</MenuItem>
            </Select>
          </Stack>
          <Controller
            name="rating"
            control={control}
            defaultValue={0}
            rules={{ required: 'rating should more than 0', validate: (value) => value > 0 }}
            render={({ field: { value, onChange } }) => (
              <Rating onChange={(_, value) => onChange(value)} value={value} precision={0.5} size="large" />
            )}
          />
        </Stack>
        <Controller
          name="content"
          control={control}
          rules={{ required: 'content should not empty', validate: validateContent }}
          render={({ field: { value, onChange } }) => (
            <RichTextEditor id={REVIEW_FORM_ID} defaultValue={value as TNode[]} onChange={onChange} />
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
