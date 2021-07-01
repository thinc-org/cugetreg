import { CustomSelect } from '@/components/common/CustomSelect'
import { Caption } from '@/modules/CourseSearch/component/CourseCard/components/Caption'
import { dayOfWeekMapper } from '@/constants/dayOfWeek'
import { CourseCartItem, courseCartStore } from '@/store'
import { Grid, Hidden, IconButton, Stack, Typography, useTheme } from '@material-ui/core'
import { observer } from 'mobx-react'
import { useCallback } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { Analytics } from '@/context/analytics/components/Analytics'
import { HIDE_COURSE, DELETE_COURSE, SECTION_CHANGE } from '@/context/analytics/components/const'
import {
  CardBorder,
  CardContent,
  CardLayout,
  DeleteButton,
  GridSpacer,
  HeaderLayout,
  LeftPane,
  OverlappingCardBorder,
  RightPane,
  Spacer,
  VisibilityToggle,
  StyledLink,
} from './styled'

export interface ScheduleTableCardProps {
  item: CourseCartItem
  index: number
  hasOverlap: boolean
}

export interface CardComponentProps {
  item: CourseCartItem
}

export const ScheduleTableCard = observer(({ item, index, hasOverlap }: ScheduleTableCardProps) => {
  const { courseNo, isHidden } = item
  const toggleVisibility = useCallback(() => {
    courseCartStore.toggleHiddenItem(courseNo)
  }, [courseNo])
  return (
    <Draggable key={item.courseNo} draggableId={item.courseNo} index={index}>
      {(provided) => (
        <CardLayout ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <CardContent>
            <LeftPane>
              <Analytics elementId={courseNo} elementName={HIDE_COURSE}>
                {({ log }) => (
                  <VisibilityToggle
                    checked={!isHidden}
                    onClick={() => {
                      log()
                      toggleVisibility()
                    }}
                  >
                    {isHidden ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </VisibilityToggle>
                )}
              </Analytics>
              <Analytics elementId={courseNo} elementName={DELETE_COURSE}>
                {({ log }) => (
                  <DeleteButton
                    onClick={() => {
                      log()
                      courseCartStore.removeCourse(item)
                    }}
                  >
                    <MdDelete />
                  </DeleteButton>
                )}
              </Analytics>
            </LeftPane>
            <RightPane>
              <CardHeader item={item} />
              <CardDetail item={item} />
            </RightPane>
          </CardContent>
          {hasOverlap ? <OverlappingCardBorder /> : <CardBorder />}
        </CardLayout>
      )}
    </Draggable>
  )
})

function CardHeader({ item }: CardComponentProps) {
  const { t } = useTranslation('scheduleTableCard')
  const theme = useTheme()
  return (
    <HeaderLayout>
      <StyledLink href={`/${item.studyProgram}/courses/${item.courseNo}`}>
        <Typography variant="h5" style={{ marginRight: 16 }}>
          {item.courseNo} {item.abbrName}
        </Typography>
      </StyledLink>

      <Typography variant="h6" color={theme.palette.primaryRange[100]} style={{ marginRight: 32 }}>
        {t('credits', { credits: item.credit })}
      </Typography>
      <Hidden smDown>
        <SectionSelect item={item} />
        <Spacer />
      </Hidden>
      <Hidden mdDown>
        <IconButton aria-label={t('delete')} onClick={() => courseCartStore.removeCourse(item)}>
          <MdDelete />
        </IconButton>
      </Hidden>
    </HeaderLayout>
  )
}

function SectionSelect({ item }: CardComponentProps) {
  const { t } = useTranslation('scheduleTableCard')
  return (
    <Analytics elementName={SECTION_CHANGE} elementId={item.courseNo}>
      {({ log }) => (
        <CustomSelect
          value={item.selectedSectionNo}
          onChange={(e) => {
            const sectionNumber = e.target.value as string
            log(null, sectionNumber)
            courseCartStore.addItem(item, sectionNumber)
          }}
        >
          {item.sections.map((sec) => (
            <option key={sec.sectionNo} value={sec.sectionNo}>
              {t('sectionLabel', { section: sec.sectionNo })}
            </option>
          ))}
        </CustomSelect>
      )}
    </Analytics>
  )
}

function CardDetail({ item }: CardComponentProps) {
  const { t } = useTranslation('courseCard')
  const section = item.sections.find((section) => section.sectionNo === item.selectedSectionNo)!
  const teachers = section?.classes.flatMap((cls) => cls.teachers)
  return (
    <Grid container spacing={1} sx={{ mt: -1, mb: 2 }}>
      <Hidden smUp>
        <Grid item xs={6} style={{ display: 'flex', alignContent: 'center' }}>
          <SectionSelect item={item} />
        </Grid>
      </Hidden>
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('teacher')}</Caption>
          <Typography variant="body1" sx={{ maxWidth: '15ch' }}>
            {teachers.join(', ')}
          </Typography>
        </Stack>
      </Grid>
      <GridSpacer />
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('time')}</Caption>
          <Stack>
            {section.classes.map((sectionClass, index) => (
              <Typography variant="body1" key={`${section.sectionNo}.${index}`}>
                {sectionClass.dayOfWeek && dayOfWeekMapper[sectionClass.dayOfWeek]} {sectionClass.period?.start}-
                {sectionClass.period?.end}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Grid>
      <GridSpacer />
      <Grid item xs={6} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('classRoom')}</Caption>
          <Stack>
            {section.classes.map((sectionClass, index) => (
              <Typography variant="body1" key={`${section.sectionNo}.${index}`}>
                {sectionClass.building} {sectionClass.room}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  )
}
