import { Button, Card, CardContent, Collapse, Grid, IconButton, Typography } from '@material-ui/core'
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
      <CardContent className={classes.cardBody}>
        <div className={classes.top}>
          <Grid container spacing={1}>
            <Grid item>
              <Typography variant="h5">
                {course.courseNo} {course.abbrName}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" className={classes.caption}>
                {t('credit', { credit: course.credit })}
              </Typography>
            </Grid>
            <Grid item className={classes.genedTop}>
              <GenEdChip category={course.genEdType} />
            </Grid>
          </Grid>

          <div className={classes.starTop}>
            <Star />
            <Typography variant="h6" display="inline">
              {rating}
            </Typography>
          </div>

          <IconButton size="small" onClick={onToggle} className={classes.chev}>
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </div>

        <div className={classes.body}>
          <div className={classes.dayChip}>
            <Label>{t('classDay')}</Label>
            <Grid container spacing={1}>
              {classDays.map((day) => (
                <Grid item key={day}>
                  <DayChip category={day} />
                </Grid>
              ))}
            </Grid>
          </div>
          <div className={classes.genedBody}>
            <Label>{t('genEd')}</Label>
            <div>
              <GenEdChip category={course.genEdType} />
            </div>
          </div>
          <div className={classes.totalCapacity}>
            <Label>{t('totalCapacity')}</Label>
            <Typography variant="body1">
              GenEd {courseCapacity.current}/{courseCapacity.max}
            </Typography>
          </div>
          <div className={classes.starBody}>
            <Label>{t('rating')}</Label>
            <Typography variant="h6" className={classes.caption}>
              <Star /> {rating}
            </Typography>
          </div>
        </div>

        <Collapse in={isExpanded}>
          <div className={classes.detail}>
            <div className={classes.select}>
              <Select
                items={sectionNumbers}
                value={selectedSectionNumber}
                onChange={(e) => setSectionNumber(e.target.value as string)}
                name="sectionNo"
              />
            </div>

            <div className={classes.teacher}>
              <Label>{t('teacher')}</Label>
              <Typography variant="body1">{teachers.join(', ')}</Typography>
            </div>
            <div className={classes.time}>
              <Label>{t('time')}</Label>
              <div>
                {selectedSection.classes.map((sectionClass, index) => (
                  <Typography variant="body1" key={`${selectedSection.sectionNo}.${index}`}>
                    {days[sectionClass.dayOfWeek]} {sectionClass.period.start}-{sectionClass.period.end}
                  </Typography>
                ))}
              </div>
            </div>
            <div className={classes.classRoom}>
              <Label>{t('classRoom')}</Label>
              <div>
                {selectedSection.classes.map((sectionClass, index) => (
                  <Typography variant="body1" key={`${selectedSection.sectionNo}.${index}`}>
                    {sectionClass.building} {sectionClass.room}
                  </Typography>
                ))}
              </div>
            </div>
            <div className={classes.note}>
              <Label>{t('note')}</Label>
              <Typography variant="body1">{selectedSection.note}</Typography>
            </div>
            <div className={classes.capacity}>
              <Label>{t('capacity')}</Label>
              <Typography variant="body1">
                {selectedSection.capacity.current}/{selectedSection.capacity.max}
              </Typography>
            </div>
          </div>
        </Collapse>

        <div className={classes.action}>
          <Collapse in={isExpanded}>
            <div className={classes.selectAction}>
              <Select
                items={sectionNumbers}
                value={selectedSectionNumber}
                onChange={(e) => setSectionNumber(e.target.value as string)}
                name="sectionNo"
              />
            </div>
          </Collapse>
          <Button
            className={classes.button}
            startIcon={<Add />}
            color="primary"
            variant="contained"
            fullWidth
            disableElevation
          >
            {t('select')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
