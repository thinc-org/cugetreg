import { Box, CardContent, Collapse, Grid, Stack, Typography } from '@material-ui/core'
import { DayOfWeek } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'
import GenEdChip from '@/components/Chips/catagories/GenEdChip'
import DayChip from '@/components/Chips/catagories/DayChip'
import { Caption } from '@/components/CourseCard/components/Caption'
import { dayOfWeekMapper } from '@/constants/dayOfWeek'
import { SelectButton } from '@/components/SelectButton'
import { SectionSelect } from './SectionSelect'
import { useCourseCardContext } from '../useCourseCard'

interface CardBodyProps {
  isExpanded: boolean
}

export function CardBody({ isExpanded }: CardBodyProps) {
  return (
    <CardContent sx={{ px: 4, py: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
        <Stack>
          <CardDescription />
          <Collapse in={isExpanded}>
            <CardHiddenDescription />
          </Collapse>
        </Stack>
        <CardSideActions isExpanded={isExpanded} />
      </Box>
    </CardContent>
  )
}

function CardDescription() {
  const { t } = useTranslation('courseCard')
  const { course, isGenEd, classDays, courseCapacity } = useCourseCardContext()
  return (
    <Grid container spacing={3}>
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('classDay')}</Caption>
          <div>
            {classDays.map((day: DayOfWeek) => (
              <DayChip type={day} key={day} sx={{ mb: 0.5, mr: 0.5 }} />
            ))}
          </div>
        </Stack>
      </Grid>
      {isGenEd && (
        <Grid item xs={6} sm="auto" sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <Stack spacing={0.5} alignItems="flex-start">
            <Caption>{t('genEd')}</Caption>
            <GenEdChip type={course.genEdType} />
          </Stack>
        </Grid>
      )}
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          {isGenEd ? (
            <>
              <Caption>{t('totalCapacity')}</Caption>
              <Typography variant="body1">
                GenEd {courseCapacity.current}/{courseCapacity.max}
              </Typography>
            </>
          ) : (
            <>
              <Caption>{t('condition')}</Caption>
              <Typography variant="body1">{course.courseCondition}</Typography>
            </>
          )}
        </Stack>
      </Grid>
      {/* rating is not implemented yet */}
      {/* {isGenEd && (
        <Grid item xs={6} sm="auto" sx={{ display: { xs: 'flex', sm: 'none' } }}>
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

function CardHiddenDescription() {
  const { t } = useTranslation('courseCard')
  const { selectedSection, teachers } = useCourseCardContext()
  return (
    <Grid container spacing={3} sx={{ mt: 0, width: 'auto' }}>
      <Grid item xs={6} sm="auto" sx={{ display: { xs: 'block', sm: 'none' } }}>
        <SectionSelect />
      </Grid>
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('teacher')}</Caption>
          <Typography variant="body1" sx={{ maxWidth: '15ch' }}>
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
                {sectionClass.dayOfWeek && dayOfWeekMapper[sectionClass.dayOfWeek]} {sectionClass.period?.start}-
                {sectionClass.period?.end}
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

function CardSideActions({ isExpanded }: CardBodyProps) {
  const { course, selectedSectionNumber } = useCourseCardContext()
  return (
    <Stack
      sx={{
        display: { xs: 'none', sm: 'flex' },
        flexBasis: 'auto',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        ml: 2,
      }}
    >
      <Collapse in={isExpanded}>
        <SectionSelect />
      </Collapse>
      <SelectButton course={course} selectedSectionNumber={selectedSectionNumber} />
    </Stack>
  )
}
