import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { Course } from '@thinc-org/chula-courses'
import { Add, Star } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { days } from './const'
import { useDisclosure } from '@/hooks/useDisclosure'
import { Select } from '../Select'
import { useCourseCard } from './useCourseCard'
import GenEdChip from '../Chips/catagories/GenEdChip'
import DayChip from '../Chips/catagories/DayChip'

export interface CourseCardProps {
  course: Course
  rating?: number
}

export const CourseCard = (props: CourseCardProps) => {
  const { course, rating } = props
  const { t } = useTranslation('courseCard')
  const { isOpen: isExpanded, onToggle } = useDisclosure()

  const {
    isGenEd,
    classDays,
    courseCapacity,
    setSectionNumber,
    selectedSection,
    teachers,
    sectionNumbers,
    selectedSectionNumber,
  } = useCourseCard(course)

  return (
    <Card variant="outlined">
      <CardHeader
        sx={{ p: 4, pb: 0, pt: 3 }}
        title={
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Grid container spacing={1}>
              <Grid item>
                <Typography variant="h5">
                  {course.courseNo} {course.abbrName}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" sx={{ color: 'primaryRange.100' }}>
                  {t('credit', { credit: course.credit })}
                </Typography>
              </Grid>
              {isGenEd && (
                <Grid item>
                  <GenEdChip sx={{ display: { xs: 'none', sm: 'inline-flex' } }} type={course.genEdType} />
                </Grid>
              )}
            </Grid>
            {isGenEd && (
              <Stack direction="row" spacing={0.25} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Star />
                <Typography variant="h6">{rating}</Typography>
              </Stack>
            )}
          </Box>
        }
        action={
          <IconButton onClick={onToggle} color="primary">
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        }
      />

      <CardContent sx={{ px: 4, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
          <Stack sx={{ width: '100%' }}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm="auto">
                <Stack spacing={0.5}>
                  <Typography variant="caption">{t('classDay')}</Typography>
                  <div>
                    {classDays.map((day) => (
                      <DayChip type={day} key={day} sx={{ mb: 0.5, mr: 0.5 }} />
                    ))}
                  </div>
                </Stack>
              </Grid>
              {isGenEd && (
                <Grid item xs={6} sm="auto" sx={{ display: { xs: 'flex', sm: 'none' } }}>
                  <Stack spacing={0.5} alignItems="flex-start">
                    <Typography variant="caption">{t('genEd')}</Typography>
                    <GenEdChip type={course.genEdType} />
                  </Stack>
                </Grid>
              )}
              <Grid item xs={6} sm="auto">
                <Stack spacing={0.5}>
                  {isGenEd ? (
                    <>
                      <Typography variant="caption">{t('totalCapacity')}</Typography>
                      <Typography variant="body1">
                        GenEd {courseCapacity.current}/{courseCapacity.max}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="caption">{t('condition')}</Typography>
                      <Typography variant="body1">{course.courseCondition}</Typography>
                    </>
                  )}
                </Stack>
              </Grid>
              {isGenEd && (
                <Grid item xs={6} sm="auto" sx={{ display: { xs: 'flex', sm: 'none' } }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption">{t('rating')}</Typography>
                    <Stack direction="row" spacing={0.25}>
                      <Star />
                      <Typography variant="h6">{rating}</Typography>
                    </Stack>
                  </Stack>
                </Grid>
              )}
            </Grid>

            <Collapse in={isExpanded}>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={6} sm="auto" sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <Select
                    items={sectionNumbers}
                    value={selectedSectionNumber}
                    onChange={(e) => setSectionNumber(e.target.value as string)}
                    name="sectionNo"
                  />
                </Grid>
                <Grid item xs={6} sm="auto">
                  <Stack spacing={0.5}>
                    <Typography variant="caption">{t('teacher')}</Typography>
                    <Typography variant="body1" sx={{ maxWidth: '15ch' }}>
                      {teachers.join(', ')}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm="auto">
                  <Stack spacing={0.5}>
                    <Typography variant="caption">{t('time')}</Typography>
                    <Stack>
                      {selectedSection.classes.map((sectionClass, index) => (
                        <Typography variant="body1" key={`${selectedSection.sectionNo}.${index}`}>
                          {days[sectionClass.dayOfWeek]} {sectionClass.period.start}-{sectionClass.period.end}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm="auto">
                  <Stack spacing={0.5}>
                    <Typography variant="caption">{t('classRoom')}</Typography>
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
                    <Typography variant="caption">{t('note')}</Typography>
                    <Typography variant="body1">{selectedSection.note}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm="auto">
                  <Stack spacing={0.5}>
                    <Typography variant="caption">{t('capacity')}</Typography>
                    <Typography variant="body1">
                      {selectedSection.capacity.current}/{selectedSection.capacity.max}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Collapse>
          </Stack>

          <Stack
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexBasis: 'auto',
              justifyContent: 'space-between',
              alignItems: 'stretch',
            }}
          >
            <Collapse in={isExpanded}>
              <Select
                items={sectionNumbers}
                value={selectedSectionNumber}
                onChange={(e) => setSectionNumber(e.target.value as string)}
                name="sectionNo"
              />
            </Collapse>
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
