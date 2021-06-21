import {
  Box,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
} from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { Course } from '@thinc-org/chula-courses'
import { Add, Star } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { days } from '@/components/CourseCard/const'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useCourseCard } from '@/components/CourseCard/useCourseCard'
import GenEdChip from '@/components/Chips/catagories/GenEdChip'
import DayChip from '@/components/Chips/catagories/DayChip'
import { Caption } from '@/components/CourseCard/components/Caption'
import { CustomButton } from '@/components/common/CustomButton'
import { useMediaQuery } from '@material-ui/core'

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

  const SelectButton = (
    <CustomButton loading={false} startIcon={<Add />} color="primary" variant="contained" fullWidth disableElevation>
      {t('select')}
    </CustomButton>
  )

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const SectionSelect = (
    <FormControl fullWidth={isDesktop}>
      <Select
        value={selectedSectionNumber}
        onChange={(e) => setSectionNumber(e.target.value as string)}
        name="sectionNo"
      >
        {sectionNumbers.map((value) => (
          <MenuItem key={value} value={value}>
            Sec {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const CardHeading = (
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
              <Typography variant="h6" color="primaryRange.100">
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
  )

  const CardDescription = (
    <Grid container spacing={3}>
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('classDay')}</Caption>
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
      {isGenEd && (
        <Grid item xs={6} sm="auto" sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <Stack spacing={0.5}>
            <Caption>{t('rating')}</Caption>
            <Stack direction="row" spacing={0.25} color="primaryRange.100">
              <Star />
              <Typography variant="h6">{rating}</Typography>
            </Stack>
          </Stack>
        </Grid>
      )}
    </Grid>
  )

  const CardHiddenDescription = (
    <Grid container spacing={3} sx={{ mt: 0, width: 'auto' }}>
      <Grid item xs={6} sm="auto" sx={{ display: { xs: 'block', sm: 'none' } }}>
        {SectionSelect}
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
                {days[sectionClass.dayOfWeek]} {sectionClass.period?.start}-{sectionClass.period?.end}
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

  const CardSideActions = (
    <Stack
      sx={{
        display: { xs: 'none', sm: 'flex' },
        flexBasis: 'auto',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        ml: 2,
      }}
    >
      <Collapse in={isExpanded}>{SectionSelect}</Collapse>
      {SelectButton}
    </Stack>
  )

  const CardBody = (
    <CardContent sx={{ px: 4, py: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
        <Stack>
          {CardDescription}
          <Collapse in={isExpanded}>{CardHiddenDescription}</Collapse>
        </Stack>
        {CardSideActions}
      </Box>
    </CardContent>
  )

  const CardFooter = <CardActions sx={{ p: 4, pt: 0, display: { sm: 'none' } }}>{SelectButton}</CardActions>

  return (
    <Paper variant="outlined" sx={{ width: '100%' }}>
      {CardHeading}
      {CardBody}
      {CardFooter}
    </Paper>
  )
}
