import { Grid, Hidden, IconButton, Stack, Typography, useTheme } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { PanInfo } from 'framer-motion'
import { uniq } from 'lodash'
import { observer } from 'mobx-react'
import { useCallback } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'

import { Caption } from '@/common/components/Caption'
import { dayOfWeekMapper } from '@/common/constants/dayOfWeek'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@/common/context/Analytics/components/LinkWithAnalytics'
import {
  HIDE_COURSE,
  DELETE_COURSE,
  SECTION_CHANGE,
  COURSE_TITLE_SCHEDULE_CARD,
  COLOR_PICKER_BUTTON,
} from '@/common/context/Analytics/constants'
import { useLinkBuilderWithCourseGroup } from '@/common/hooks/useLinkBuilder'
import { getClassPeriod } from '@/common/utils/getClassPeriod'
import { ColorCircle } from '@/modules/Schedule/components/ColorCircle'
import { ColorPicker } from '@/modules/Schedule/components/ColorPicker'
import { useColorPickerModal } from '@/modules/Schedule/components/ColorPicker/hooks/useColorPicker'
import { CourseOverlap } from '@/modules/Schedule/components/Schedule/utils'
import { CourseCartItem, courseCartStore } from '@/store'

import {
  CardBorder,
  CardContent,
  CardLayout,
  DeleteButton,
  GridSpacer,
  LeftPane,
  OverlappingCardBorder,
  MiddlePane,
  Spacer,
  VisibilityToggle,
  RightPane,
  StyledNativeSelect,
  ColorPickerButton,
} from './styled'
import { useOverlapWarning } from './utils'

export interface ScheduleTableCardProps {
  item: CourseCartItem
  index: number
  overlaps: CourseOverlap
}

export interface CardComponentProps {
  item: CourseCartItem
}

export interface CardDetailProps extends CardComponentProps {
  overlaps?: CourseOverlap
}

/* fixed axis drag hack */
function getStyle(style: React.CSSProperties | undefined) {
  if (style?.transform) {
    const axisLockY = `translate(0px, ${style.transform.split(',').pop()}`
    return { ...style, transform: axisLockY }
  }
  return style
}

export const ScheduleTableCard = observer(({ item, index, overlaps }: ScheduleTableCardProps) => {
  const { courseNo, isHidden } = item
  const toggleVisibility = useCallback(() => {
    courseCartStore.toggleHiddenItem(item)
  }, [item])

  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.up('md'))
  const [swipped, setSwipped] = useState(false)
  const x = swipped ? -40 : 0
  useEffect(() => {
    if (match) {
      setSwipped(false)
    }
  }, [match])

  function onDragEnd(e: MouseEvent, { offset, point }: PanInfo) {
    // cancelling drag event due to scrolling
    if (point.x == 0 && point.y == 0) {
      return
    }
    const DRAG_THRESHHOLD = 25
    if (swipped) {
      if (offset.x > DRAG_THRESHHOLD) {
        setSwipped(false)
      }
    } else {
      if (offset.x < -DRAG_THRESHHOLD) {
        setSwipped(true)
      }
    }
  }

  return (
    <Draggable key={item.courseNo} draggableId={item.courseNo} index={index}>
      {(provided) => (
        <CardLayout
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getStyle(provided.draggableProps.style)}
        >
          <CardContent
            drag={match ? false : 'x'}
            initial={{ x }}
            animate={{ x }}
            dragConstraints={{ left: x, right: x }}
            dragDirectionLock
            onDragEnd={onDragEnd}
          >
            <MiddlePane>
              <CardHeader item={item} />
              <CardDetail item={item} overlaps={overlaps} />
            </MiddlePane>
          </CardContent>

          <LeftPane>
            <Analytics elementId={courseNo} elementName={HIDE_COURSE}>
              <VisibilityToggle checked={!isHidden} onClick={toggleVisibility}>
                {isHidden ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </VisibilityToggle>
            </Analytics>
          </LeftPane>

          <RightPane>
            <Analytics elementId={courseNo} elementName={DELETE_COURSE}>
              <DeleteButton onClick={() => courseCartStore.removeCourse(item)}>
                <MdDelete />
              </DeleteButton>
            </Analytics>
          </RightPane>
          {overlaps?.hasOverlap ? <OverlappingCardBorder /> : <CardBorder />}
        </CardLayout>
      )}
    </Draggable>
  )
})

function CardHeader({ item }: CardComponentProps) {
  const { t } = useTranslation('scheduleTableCard')
  const theme = useTheme()
  const { buildLink } = useLinkBuilderWithCourseGroup(item)
  const { handleClick, ...colorPickerProps } = useColorPickerModal(item)
  return (
    <Stack direction="row" pt={1} my={0.5} pr={2}>
      <Stack direction="row" flex={1} justifyContent="space-between" alignItems="flex-start">
        <Grid container columnGap={2} alignItems="center" py={0.5}>
          <Grid item>
            <LinkWithAnalytics
              href={buildLink(`/courses/${item.courseNo}`)}
              passHref
              elementName={COURSE_TITLE_SCHEDULE_CARD}
              elementId={item.courseNo}
            >
              <Typography variant="h5">
                {item.courseNo} {item.abbrName}
              </Typography>
            </LinkWithAnalytics>
          </Grid>
          <Grid item>
            <Typography variant="h6" color={theme.palette.primaryRange[100]}>
              {t('credits', { credits: item.credit })}
            </Typography>
          </Grid>
          <Grid item>
            <Hidden smDown>
              <SectionSelect item={item} />
              <Spacer />
            </Hidden>
          </Grid>
        </Grid>
        <ColorPicker scheduleClass={item} {...colorPickerProps} />
        <Analytics elementName={COLOR_PICKER_BUTTON} elementId={item.courseNo}>
          <ColorPickerButton onClick={handleClick} sx={{ mr: { xs: 0, md: 1 } }}>
            <Typography variant="subtitle1" display={{ xs: 'none', md: 'inline' }} mr={1} color="primaryRange.200">
              {t('selectColor')}
            </Typography>
            <ColorCircle color={item.color} size={24} />
          </ColorPickerButton>
        </Analytics>
      </Stack>
      <Hidden mdDown>
        <IconButton aria-label={t('delete')} onClick={() => courseCartStore.removeCourse(item)}>
          <MdDelete />
        </IconButton>
      </Hidden>
    </Stack>
  )
}

function SectionSelect({ item }: CardComponentProps) {
  const { t } = useTranslation('scheduleTableCard')
  return (
    <Analytics elementName={SECTION_CHANGE} elementId={item.courseNo}>
      {({ log }) => (
        <StyledNativeSelect
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
        </StyledNativeSelect>
      )}
    </Analytics>
  )
}

function CardDetail({ item, overlaps }: CardDetailProps) {
  const { t } = useTranslation('scheduleTableCard')
  const section = item.sections.find((section) => section.sectionNo === item.selectedSectionNo)!
  const teachers = uniq(section.classes.flatMap((cls) => cls.teachers))
  const warning = useOverlapWarning(overlaps)
  return (
    <Grid container spacing={1} sx={{ mt: -1, mb: 2 }}>
      <Hidden smUp>
        <Grid item xs={5} style={{ display: 'flex', alignContent: 'center' }}>
          <SectionSelect item={item} />
        </Grid>
      </Hidden>
      <Grid item xs={7} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('teacher')}</Caption>
          <Typography variant="body1" sx={{ maxWidth: '15ch' }}>
            {teachers.join(', ')}
          </Typography>
        </Stack>
      </Grid>
      <GridSpacer />
      <Grid item xs={5} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('time')}</Caption>
          <Stack>
            {section.classes.map((sectionClass, index) => (
              <Typography variant="body1" key={`${section.sectionNo}.${index}`}>
                {sectionClass.dayOfWeek && dayOfWeekMapper[sectionClass.dayOfWeek]} {getClassPeriod(sectionClass)}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Grid>
      <GridSpacer />
      <Grid item xs={4} sm="auto">
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
      <GridSpacer />
      <Grid item xs={3} sm="auto">
        <Stack spacing={0.5}>
          <Caption>{t('classType')}</Caption>
          <Stack>
            {section.classes.map((sectionClass, index) => (
              <Typography variant="body1" key={`${section.sectionNo}.${index}`}>
                {sectionClass.type}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Grid>
      <GridSpacer />
      <Grid item xs alignSelf="flex-end" sx={{ pr: { xs: 2, sm: 3 } }}>
        <Typography variant="subtitle1" color="highlight.red.500" textAlign={{ xs: 'left', sm: 'right' }}>
          {warning}
        </Typography>
      </Grid>
    </Grid>
  )
}
