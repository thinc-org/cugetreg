import { Rating, Select, Stack, MenuItem, Typography, Button, Alert } from '@mui/material'
import { endOfDay, format } from 'date-fns'
import Link from 'next/link'

import { useContext } from 'react'
import { Controller, SubmitHandler, SubmitErrorHandler, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { INITIAL_CONTENT } from '@/common/components/RichText/constants'
import { SnackbarContext } from '@/common/context/Snackbar'
import { getCurrentTerm } from '@/common/utils/getCurrentTerm'
import { useReviewContext } from '@/modules/CourseDetail/context/Review'
import { ReviewState } from '@/modules/CourseDetail/context/Review/types'

import { RichTextEditor } from '../../../../common/components/RichText'
import { YEAR_SIZE } from './constants'

export const ReviewForm: React.FC = () => {
  const { register, handleSubmit, control, setValue } = useFormContext<ReviewState>()
  const { academicYear, semester } = getCurrentTerm()
  const { t } = useTranslation('review')
  const { emitMessage } = useContext(SnackbarContext)
  const { submitReview, submitEditedReview, editingReviewId, cancelEditReview } = useReviewContext()

  const getYearList = (size: number): number[] => {
    const currentYear = parseInt(format(endOfDay(new Date()), 'yyyy')) + 543
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
    const allErros = Object.keys(errors).join(', ')
    emitMessage(`คุณยังกรอกข้อมูลไม่ครบ ${allErros}`, 'error')
  }

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        <Stack direction="row" gap={1} flexWrap="wrap">
          นโยบายรักษาความเป็นส่วนตัวของการรีวิวรายวิชา
          <Link href="/privacy">อ่านเพิ่มเติม</Link>
        </Stack>
      </Alert>
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
          justifyContent="space-between"
          gap={1}
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
          defaultValue={'<p></p>'}
          render={({ field: { value, onChange } }) => <RichTextEditor value={value} onChange={onChange} />}
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
