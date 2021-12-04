import { Rating, Select, Stack, MenuItem, Typography, Button } from '@mui/material'
import { useContext } from 'react'
import { Controller, SubmitHandler, SubmitErrorHandler, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MultiplelineTextField } from '@/common/components/MultiplelineTextField'
import { SnackbarContext } from '@/common/context/Snackbar'
import { getCurrentTerm } from '@/common/utils/getCurrentTerm'
import { useReviewContext } from '@/modules/CourseDetail/context/Review'
import { ReviewState } from '@/modules/CourseDetail/context/Review/types'

export const ReviewForm: React.FC = () => {
  const { register, handleSubmit, control } = useFormContext<ReviewState>()
  const { academicYear, semester } = getCurrentTerm()
  const { t } = useTranslation('review')
  const { emitMessage } = useContext(SnackbarContext)
  const { submitReview, submitEditedReview, editingReviewId, cancelEditReview } = useReviewContext()

  const onSubmit: SubmitHandler<ReviewState> = async () => {
    if (editingReviewId) await submitEditedReview(editingReviewId)
    else await submitReview()
  }

  const onError: SubmitErrorHandler<ReviewState> = (errors) => {
    const allErros = Object.keys(errors).join(', ')
    emitMessage(`คุณยังกรอกข้อมูลไม่ครบ ${allErros}`, 'error')
  }

  return (
    <>
      <Typography variant="h4" mt={5} id="review-title">
        {t('title')}
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
              <MenuItem value="2564">2564</MenuItem>
              <MenuItem value="2563">2563</MenuItem>
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
        <MultiplelineTextField
          fullWidth
          placeholder="คิดว่าวิชานี้เป็นอย่างไรบ้าง?"
          {...register('content', { required: 'need to write at least 1 character' })}
        />
        <Stack mt={2} mb={4} direction="row" spacing={2}>
          {editingReviewId && (
            <Button variant="outlined" fullWidth onClick={cancelEditReview}>
              ยกเลิก
            </Button>
          )}
          <Button variant="contained" fullWidth type="submit">
            ส่งรีวิว
          </Button>
        </Stack>
      </form>
    </>
  )
}
