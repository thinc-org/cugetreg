import { useTranslation } from 'react-i18next'

import { Grid, Stack, Typography } from '@mui/material'

import { Caption } from '@web/common/components/Caption'
import { DayChip } from '@web/common/components/Chips/catagories/DayChip'
import { GenEdChip } from '@web/common/components/Chips/catagories/GenEdChip'
import { NoSeatIcon } from '@web/common/components/NoSeatIcon'
import { useCourseCard } from '@web/modules/CourseSearch/components/CourseCard/context'

import { DayOfWeek, GenEdType } from '@libs/codegen'

export function CardDescription() {
  const { t } = useTranslation('courseCard')
  const { course, isGenEd, classDays, courseCapacity } = useCourseCard()

  const availableClassDays = classDays.filter((day) => day !== 'IA' && day !== 'AR')

  return (
    <Grid container spacing={3}>
      {availableClassDays.length > 0 && (
        <Grid item xs={6} sm="auto">
          <Stack spacing={0.5}>
            <Caption>{t('classDay')}</Caption>
            <div>
              {availableClassDays.length
                ? availableClassDays.map((day: DayOfWeek) => (
                    <DayChip type={day} key={day} sx={{ mb: 0.5, mr: 0.5 }} />
                  ))
                : '-'}
            </div>
          </Stack>
        </Grid>
      )}
      {isGenEd && (
        <Grid item xs={6} sm="auto" display={['flex', 'none']}>
          <Stack spacing={0.5} alignItems="flex-start">
            <Caption>{t('genEd')}</Caption>
            <GenEdChip type={course.genEdType as GenEdType} />
          </Stack>
        </Grid>
      )}
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          {isGenEd ? (
            <>
              <Caption>{t('totalCapacity')}</Caption>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body1">
                  GenEd {courseCapacity.current}/{courseCapacity.max}
                </Typography>
                <NoSeatIcon color="primary" />
              </Stack>
            </>
          ) : (
            course.courseCondition !== '-' && (
              <>
                <Caption>{t('condition')}</Caption>
                <Typography variant="body1">{course.courseCondition}</Typography>
              </>
            )
          )}
        </Stack>
      </Grid>
      {/* rating is not implemented yet */}
      {/* {isGenEd && (
        <Grid item xs={6} sm="auto" display={['flex', 'none']}>
          <Stack spacing={0.5}>
            <Caption>{t('rating')}</Caption>
            <Stack direction="row" spacing={0.25} color="primaryRange.100">
              <Star />
              <Typography variant="h6">{rating}</Typography>
            </Stack>
          </Stack>
        </Grid>
      )} */}
    </Grid>
  )
}
