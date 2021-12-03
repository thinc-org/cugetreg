import { Rating, Select, Stack, MenuItem, Typography, Button } from '@mui/material'
import { SemesterEnum } from '@thinc-org/chula-courses'
import { useContext } from 'react'
import { Controller, SubmitHandler, SubmitErrorHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MultiplelineTextField } from '@/common/components/MultiplelineTextField'
import { SnackbarContext } from '@/common/context/Snackbar'
import { getCurrentTerm } from '@/common/utils/getCurrentTerm'
import { ReviewContext } from '@/modules/CourseDetail/context/Review'

interface FormValues {
  academicYear: string
  semester: SemesterEnum
  rating: string
  content: string
}

export const ReviewForm: React.FC = () => {
  const { register, handleSubmit, control } = useForm<FormValues>()
  const { academicYear, semester } = getCurrentTerm()
  const { t } = useTranslation('review')
  const { emitMessage } = useContext(SnackbarContext)

  const { submitReview } = useContext(ReviewContext)

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    submitReview({
      academicYear: data.academicYear,
      semester: data.semester,
      rating: parseFloat(data.rating) as number,
      content: data.content,
    })
  }

  const onError: SubmitErrorHandler<FormValues> = (errors) => {
    const allErros = Object.keys(errors).join(', ')
    emitMessage(`คุณยังกรอกข้อมูลไม่ครบ ${allErros}`, 'error')
  }

  return (
    <>
      <Typography variant="h4" mt={5}>
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
            rules={{ required: 'rating should more than 0', validate: (value) => parseFloat(value) > 0 }}
            render={({ field: { value, ...rest } }) => (
              <Rating {...rest} value={parseFloat(value)} precision={0.5} size="large" />
            )}
          />
        </Stack>
        <Controller
          name="content"
          control={control}
          rules={{ required: 'need to write at least 1 character' }}
          render={({ field }) => (
            <MultiplelineTextField fullWidth placeholder="คิดว่าวิชานี้เป็นอย่างไรบ้าง?" {...field} />
          )}
        />
        <Stack mt={2} mb={4}>
          <Button variant="contained" fullWidth type="submit">
            ส่งรีวิว
          </Button>
        </Stack>
      </form>
    </>
  )
}
