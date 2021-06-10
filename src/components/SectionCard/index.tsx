import { Box, Button, Card, CardActions, CardContent, CardHeader, Stack, Typography } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { Course, Section } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'
import GenEdChip from '../Chips/catagories/GenEdChip'
import { Caption } from '../CourseCard/components/Caption'
import { days } from '../CourseCard/const'
import { SectionStatus } from './components/SectionStatus'

interface SectionCardProps {
  section: Section
  course: Course
}

export const SectionCard = (props: SectionCardProps) => {
  const { section, course } = props
  const { t } = useTranslation('sectionCard')
  return (
    <Card variant="outlined">
      <CardHeader
        sx={{ p: 4, pb: 0, pt: 3 }}
        title={
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={{ xs: 0.5, sm: 2 }} alignItems="center">
              <Typography variant="h5">{t('section', { sectionNo: section.sectionNo })}</Typography>
              {course.genEdType !== 'NO' && <GenEdChip type={course.genEdType} />}
            </Stack>
            <SectionStatus
              capacity={section.capacity}
              status={
                section.closed ? 'closed' : section.capacity.current === section.capacity.max ? 'full' : 'avialable'
              }
            />
          </Box>
        }
      />
      <CardContent sx={{ px: 4, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={{ xs: 2, sm: 5 }}>
            <Stack spacing={0.5}>
              <Caption>{t('teacher')}</Caption>
              <Stack>
                {section.classes.map((sectionClass, index) => (
                  <Typography variant="body1" sx={{ maxWidth: '15ch' }} key={index}>
                    {sectionClass.teachers.join(', ')}
                  </Typography>
                ))}
              </Stack>
            </Stack>

            <Stack spacing={0.5}>
              <Caption>{t('time')}</Caption>
              <Stack>
                {section.classes.map((sectionClass, index) => (
                  <Typography variant="body1" key={index}>
                    {days[sectionClass.dayOfWeek]} {sectionClass.period.start}-{sectionClass.period.end}
                  </Typography>
                ))}
              </Stack>
            </Stack>
            <Stack spacing={0.5}>
              <Caption>{t('classRoom')}</Caption>
              <Stack>
                {section.classes.map((sectionClass, index) => (
                  <Typography variant="body1" key={index}>
                    {sectionClass.building} {sectionClass.room}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Stack>

          <Stack
            sx={{
              display: { xs: 'none', sm: 'flex' },
              justifyContent: 'flex-end',
              flexBasis: 'auto',
              ml: 2,
            }}
          >
            <Button startIcon={<Add />} color="primary" variant="contained" fullWidth disableElevation>
              {t('select')}
            </Button>
          </Stack>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 4, pt: 0, display: { sm: 'none' } }}>
        <Button startIcon={<Add />} color="primary" variant="contained" fullWidth disableElevation>
          {t('select')}
        </Button>
      </CardActions>
    </Card>
  )
}
