import { Caption } from '@/components/CourseCard'
import { days } from '@/components/CourseCard/const'
import { CourseCartItem, courseCartStore } from '@/store'
import { FormControl, Grid, IconButton, MenuItem, Select, Stack, Typography, useTheme } from '@material-ui/core'
import { observer } from 'mobx-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { CardLayout, GridSpacer, HeaderLayout, RightPane, Spacer, VisibilityToggle } from './styled'

export interface ScheduleTableCardProps {
  item: CourseCartItem
}

export const ScheduleTableCard = observer(({ item }: ScheduleTableCardProps) => {
  const { courseNo } = item
  const toggleVisibility = useCallback(() => {
    courseCartStore.toggleHiddenItem(courseNo)
  }, [courseNo])
  return (
    <CardLayout>
      <VisibilityToggle checked={!item.isHidden} onClick={toggleVisibility}>
        {item.isHidden ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </VisibilityToggle>
      <RightPane>
        <CardHeader item={item} />
        <CardDetail item={item} />
      </RightPane>
    </CardLayout>
  )
})

function CardHeader({ item }: ScheduleTableCardProps) {
  const { t } = useTranslation('scheduleTableCard')
  const theme = useTheme()
  return (
    <HeaderLayout>
      <Typography variant="h5" style={{ marginRight: 16 }}>
        {item.courseNo} {item.abbrName}
      </Typography>
      <Typography variant="h6" color={theme.palette.primaryRange[100]} style={{ marginRight: 32 }}>
        {t('credits', { credits: item.credit })}
      </Typography>
      <FormControl size="small">
        <Select
          value={item.selectedSectionNo}
          onChange={(e) => courseCartStore.addItem(item, e.target.value as string)}
        >
          {item.sections.map((sec) => (
            <MenuItem key={sec.sectionNo} value={sec.sectionNo}>
              {t('sectionLabel', { section: sec.sectionNo })}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Spacer />
      <IconButton aria-label={t('delete')} onClick={() => courseCartStore.removeCourse(item)}>
        <MdDelete />
      </IconButton>
    </HeaderLayout>
  )
}

function CardDetail({ item }: ScheduleTableCardProps) {
  const { t } = useTranslation('courseCard')
  const section = item.sections.find((section) => section.sectionNo === item.selectedSectionNo)!
  const teachers = section?.classes.flatMap((cls) => cls.teachers)
  return (
    <Grid container spacing={0} sx={{ mt: 0, mb: 2 }}>
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
                {days[sectionClass.dayOfWeek]} {sectionClass.period.start}-{sectionClass.period.end}
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
