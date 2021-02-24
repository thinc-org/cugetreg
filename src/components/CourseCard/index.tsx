import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  Hidden,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { Course } from '@thinc-org/chula-courses'
import { Add, Star } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { GenEdChip } from '../GenEdChip'
import { DayChip } from '../DayChip'
import { days } from './const'
import { useDisclosure } from '@/hooks/useDisclosure'
import { Select } from '../Select'
import { Label, useStyles } from './styles'
import { useCourseCard } from './useCourseCard'

export interface CourseCardProps {
  course: Course
  rating?: number
}

export const CourseCard = (props: CourseCardProps) => {
  const { course, rating } = props
  const classes = useStyles()
  const { t } = useTranslation('courseCard')
  const { isOpen: isExpanded, onToggle } = useDisclosure()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })

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
        className={classes.header}
        title={
          <Grid container justify="space-between" wrap="nowrap">
            <Grid item xs="auto" container spacing={1} alignItems="center">
              <Grid item xs={12} sm="auto" component={Typography} variant="h5">
                {course.courseNo} {course.abbrName}
              </Grid>
              <Grid item xs={12} sm="auto" component={Typography} variant="h6" className={classes.caption}>
                {t('credit', { credit: course.credit })}
              </Grid>
              {isGenEd && (
                <Hidden xsDown>
                  <Grid item xs="auto">
                    <GenEdChip category={course.genEdType} />
                  </Grid>
                </Hidden>
              )}
            </Grid>
            {isGenEd && (
              <Hidden xsDown>
                <Grid item xs>
                  <Typography variant="h6" noWrap className={classes.textStar}>
                    <Star />
                    <span>{rating}</span>
                  </Typography>
                </Grid>
              </Hidden>
            )}
          </Grid>
        }
        action={
          <IconButton onClick={onToggle} color="primary">
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        }
      />

      <CardContent className={classes.body}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item xs="auto" container>
            <Grid item container spacing={isMobile ? 2 : 4}>
              <Grid item xs={6} sm="auto">
                <Label>{t('classDay')}</Label>
                <Grid container spacing={1}>
                  {classDays.map((day) => (
                    <Grid item key={day}>
                      <DayChip category={day} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {isGenEd && (
                <Hidden smUp>
                  <Grid item xs={6} sm="auto">
                    <Label>{t('genEd')}</Label>
                    <div>
                      <GenEdChip category={course.genEdType} />
                    </div>
                  </Grid>
                </Hidden>
              )}
              <Grid item xs={6} sm="auto">
                {isGenEd ? (
                  <>
                    <Label>{t('totalCapacity')}</Label>
                    <Typography variant="body1">
                      GenEd {courseCapacity.current}/{courseCapacity.max}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Label>{t('condition')}</Label>
                    <Typography variant="body1">{course.courseCondition}</Typography>
                  </>
                )}
              </Grid>
              {isGenEd && (
                <Hidden smUp>
                  <Grid item xs={6}>
                    <Label>{t('rating')}</Label>
                    <Typography variant="h6" className={`${classes.caption} ${classes.textStar}`}>
                      <Star /> <span>{rating}</span>
                    </Typography>
                  </Grid>
                </Hidden>
              )}
            </Grid>

            <Grid item xs={12}>
              <Collapse in={isExpanded}>
                <Grid container spacing={isMobile ? 2 : 4} className={classes.detail}>
                  <Hidden smUp>
                    <Grid item xs={6} sm="auto">
                      <Select
                        items={sectionNumbers}
                        value={selectedSectionNumber}
                        onChange={(e) => setSectionNumber(e.target.value as string)}
                        name="sectionNo"
                      />
                    </Grid>
                  </Hidden>
                  <Grid item xs={6} sm="auto">
                    <Label>{t('teacher')}</Label>
                    <Typography variant="body1" className={classes.max15ch}>
                      {teachers.join(', ')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm="auto">
                    <Label>{t('time')}</Label>
                    <div>
                      {selectedSection.classes.map((sectionClass, index) => (
                        <Typography variant="body1" key={`${selectedSection.sectionNo}.${index}`}>
                          {days[sectionClass.dayOfWeek]} {sectionClass.period.start}-{sectionClass.period.end}
                        </Typography>
                      ))}
                    </div>
                  </Grid>
                  <Grid item xs={6} sm="auto">
                    <Label>{t('classRoom')}</Label>
                    <div>
                      {selectedSection.classes.map((sectionClass, index) => (
                        <Typography variant="body1" key={`${selectedSection.sectionNo}.${index}`}>
                          {sectionClass.building} {sectionClass.room}
                        </Typography>
                      ))}
                    </div>
                  </Grid>
                  <Grid item xs={6} sm="auto">
                    <Label>{t('note')}</Label>
                    <Typography variant="body1">{selectedSection.note}</Typography>
                  </Grid>
                  <Grid item xs={6} sm="auto">
                    <Label>{t('capacity')}</Label>
                    <Typography variant="body1">
                      {selectedSection.capacity.current}/{selectedSection.capacity.max}
                    </Typography>
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>
          </Grid>

          <Hidden xsDown>
            <Grid item xs container direction="column" justify="space-between">
              <Grid item component={Collapse} in={isExpanded}>
                <Select
                  items={sectionNumbers}
                  value={selectedSectionNumber}
                  onChange={(e) => setSectionNumber(e.target.value as string)}
                  name="sectionNo"
                />
              </Grid>
              <Grid
                item
                component={Button}
                startIcon={<Add />}
                color="primary"
                variant="contained"
                fullWidth
                disableElevation
              >
                {t('select')}
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </CardContent>

      <Hidden smUp>
        <CardActions className={classes.action}>
          <Button startIcon={<Add />} color="primary" variant="contained" fullWidth disableElevation>
            {t('select')}
          </Button>
        </CardActions>
      </Hidden>
    </Card>
  )
}
