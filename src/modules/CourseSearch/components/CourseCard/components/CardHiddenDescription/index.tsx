import { Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Caption } from '@/common/components/Caption'
import { dayOfWeekMapper } from '@/common/constants/dayOfWeek'
import { getClassPeriod } from '@/common/utils/getClassPeriod'
import { SectionSelect } from '@/modules/CourseSearch/components/CourseCard/components/SectionSelect'
import { useCourseCard } from '@/modules/CourseSearch/components/CourseCard/context'

export function CardHiddenDescription() {
  const { t } = useTranslation('courseCard')
  const { selectedSection, teachers } = useCourseCard()
  return (
    <Grid container spacing={3} mt={0} width="auto">
      <Grid item xs={6} sm="auto" display={['block', 'none']}>
        <SectionSelect />
      </Grid>
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('teacher')}</Caption>
          <Typography variant="body1" maxWidth="15ch">
            {teachers.join(', ')}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('time')}</Caption>
          <Stack>
            {selectedSection.classes.map((sectionClass, index) => (
              <Typography variant="body1" key={`${selectedSection.sectionNo}.${index}`}>
                {sectionClass.dayOfWeek && dayOfWeekMapper[sectionClass.dayOfWeek]} {getClassPeriod(sectionClass)}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('classRoom')}</Caption>
          <Stack>
            {selectedSection.classes.map((sectionClass, index) => (
              <Typography variant="body1" key={`${selectedSection.sectionNo}.${index}`}>
                {sectionClass.building} {sectionClass.room}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('note')}</Caption>
          <Typography variant="body1">{selectedSection.note}</Typography>
        </Stack>
      </Grid>
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('capacity')}</Caption>
          <Typography variant="body1">
            {selectedSection.capacity.current}/{selectedSection.capacity.max}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  )
}
